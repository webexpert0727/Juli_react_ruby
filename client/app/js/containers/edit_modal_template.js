import React, {Component}           from 'react';
import {connect}                    from 'react-redux';
import  LessonAction                from '../actions/lesson';
import { bindActionCreators }       from 'redux';
import BaseComponent                from '../components/base_component';
import moment                       from 'moment';
import AtomicForm                   from "atomic-form";
import ReactSelect                  from 'react-select';
import Api                          from '../actions/api';
import { getLocations }             from '../actions/location';
import { getLessonStatus }          from '../actions/lesson_status';
import { getSections }              from '../actions/section';
import { getInstructors }           from '../actions/instructor';
import { getStudents }              from '../actions/student';
import DatePicker                   from 'react-datepicker';
import TimePicker                   from 'rc-time-picker';
import Modal                        from "simple-react-modal";
import 'react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';

class EditModalTemplate extends BaseComponent {
    
  constructor(props, context){
    super(props, context);
    this._bind('afterValidation','doSubmit','selectStudent',
      'createStudentLessonList','getSelectedHourseId','removeStudent',
      'addHorseToLesson','removeHourse','lessonHorseList','changeEnStatus',
      'changeHourse','changePaidStatus','updateStudentAssingStatus',
      'editScheduledStartDate','editScheduledEndDate','startTimeChange',
      'endTimeChange','duplicateLesson','discardChanges',
      'createLocationList','changeLocation','getSelectedStudent','deleteLesson',
      'getSelectedPaidStatus','setRecuringUpdate');

    this.state={initialData: {}, includedStudents: [], lessonStudents: {},
                selectedHorses: {}, lessonStudentArray: {}, isRecuring: false,
                lessonPeopleStates: [], openDeleteLessonPopup: false,
                recurring_update_option: 'current_occurrence'}
  }

  componentWillMount(){
    // this.props.getLocations();
    this.props.getLessonStatus();
    // this.props.getSections();
    // this.props.getInstructors();
    // this.props.getStudents();
    // this.props.getHorses();
    // this.props.getEnrollmentStatuses();
  }

  componentDidMount(){
    this.setState({lessonPeopleStates: this.props.lessonDateTime.lesson_people || []})
  }

  componentWillReceiveProps(nextProps){
    var lessonDateTime = nextProps.lessonDateTime || {}
    var peoples = [];
    var lessonStudentArray = {};
    if(lessonDateTime && lessonDateTime.lesson_people){
      _.each(lessonDateTime.lesson_people, function(people){
        peoples.push(people.student_id)
        lessonStudentArray[people.student_id] = {
          enrollment_status_id: people.enrollment_status_id,
          horse_id: people.horse_id,
          student_id: people.student_id,
          paid: people.paid
        }
      });
    }

    this.setState({initialData: lessonDateTime,
      lessonStudentArray: lessonStudentArray,
      lessonPeopleStates: lessonDateTime.lesson_people,
      startTime: moment(lessonDateTime.scheduled_starttime).utc(),
      endTime: moment(lessonDateTime.scheduled_endtime).utc(),
      scheduledStartDate: moment(lessonDateTime.scheduled_date),
      scheduledEndDate: moment(lessonDateTime.scheduled_end_date),
      locationId: lessonDateTime.location_id,
      isRecuring: lessonDateTime.is_recuring
    });

    if(lessonDateTime && lessonDateTime.lesson_date_time_horses){
      var horseIds = _.map(lessonDateTime.lesson_date_time_horses, function(horse){ 
        return horse.horse_id.toString()
      });
      this.selectStudent(true, peoples);
      this.addHorseToLesson(true, horseIds);
    }
  }

  changeEnStatus(e, student){
    var data = this.state.lessonStudentArray;
    var horse_id = data[student] && data[student]['horse_id'] ? data[student]['horse_id'] : null;
    var paid = data[student] && data[student]['paid'] ? data[student]['paid'] : false;
    data[student] = {enrollment_status_id: e.target.value, horse_id: horse_id, paid: paid};
    var lessonArray = this.updateStudentAssingStatus(student, 'enrollment_status_id', e.target.value);
    this.setState({lessonStudentArray: data, lessonPeopleStates: lessonArray})
  }

  changeHourse(e, student){
    var data = this.state.lessonStudentArray;
    var enrollment_status_id = data[student] && data[student]['enrollment_status_id'] ? data[student]['enrollment_status_id'] : null;
    var paid = data[student] && data[student]['paid'] ? data[student]['paid'] : false;
    data[student] = {horse_id: e.target.value, enrollment_status_id: enrollment_status_id, paid: paid}
    var lessonArray = this.updateStudentAssingStatus(student, 'horse_id', e.target.value);
    this.setState({lessonStudentArray: data, lessonPeopleStates: lessonArray})
  }

  changePaidStatus(e, student){
    var data = this.state.lessonStudentArray;
    var isChecked = e.target.checked ? 1 : 0;
    var enrollment_status_id = data[student] && data[student]['enrollment_status_id'] ? data[student]['enrollment_status_id'] : null;
    var horse_id = data[student] && data[student]['horse_id'] ? data[student]['horse_id'] : null;
    data[student] = {horse_id: horse_id, enrollment_status_id: enrollment_status_id, paid: isChecked}
    var lessonPeopleStates = this.state.lessonPeopleStates;
    var lessonArray = this.updateStudentAssingStatus(student, 'paid', isChecked);
    this.setState({lessonStudentArray: data, lessonPeopleStates: lessonArray})
  }

  setRecuringUpdate(e){
    this.setState({recurring_update_option: e.target.value});
  }

  updateStudentAssingStatus(student, field, val){
    var lessonArray = [];
    _.each(this.state.lessonPeopleStates, function(lesson){
      if(lesson.student_id == student){
        lesson[field] = val
      }
      lessonArray.push(lesson)
    });
    return lessonArray;
  }

  afterValidation(formValidations) {
    this.setState({validations: formValidations});
  }

  validationMessage(field) {
    if (this.state.validations && this.state.validations[field]) {
      if (!this.state.validations[field].isValid) {
        return _.map(this.state.validations[field].message, (message,idx) => {
          return <span key={idx} style={{color: 'red'}}>{message}</span>;
        });
      }
    }
    return <div/>;
  }

  duplicateLesson(status){
    this.props.duplicateLesson();
  }

  deleteLesson(e, type){
    var check = confirm("Are you sure you want to delete?");
    var that = this;
    if(check){
      var id = this.props.lessonDateTime.id;
      Api.delete(`/lesson_date_times/${id}?delete_all=${type}`).then(function(res,err){
        if(res.notice == 'delete successfully'){
          that.props.updateDetetedLesson(res.lesson_date_times);
        }
      });
    }
  }

  doSubmit(formData){
    var that = this;
    var studentData = [];
    _.each(this.state.lessonStudentArray, function(value,key){
      value['student_id'] = key
      studentData.push(value)
    });

    var dataToUpdate = { lesson_date_time: {
      name: formData.name,
      is_recuring: this.state.isRecuring,
      location_id: this.state.locationId,
      lesson_people_attributes: studentData,
      lesson_notes: formData.lesson_notes,
      lesson_status_id: formData.lesson_status_id,
      section_id: formData.section_id,
      location_id: this.state.locationId,
      instructor_id: formData.instructor_id,
      scheduled_starttime: this.state.startTime.format(),
      scheduled_endtime: this.state.endTime.format(),
      scheduled_end_date: this.state.scheduledEndDate.format(),
      scheduled_date: this.state.scheduledStartDate.format(),
      recurring_update_option: this.state.recurring_update_option}
    }

    if(Object.keys(this.state.selectedHorses).length){
      var lessonHorse = [];
      _.each(this.state.selectedHorses, function(value,key){
        lessonHorse.push({horse_id: key,lesson_date_time_id: that.props.lessonDateTime.id})
      });

      dataToUpdate['lesson_date_time']['lesson_date_time_horses_attributes'] = lessonHorse;
    }

    Api.put(`/lesson_date_times/${this.props.lessonDateTime.id}`,dataToUpdate).then(function(res,err){
      if(res.notice == 'successfully updated'){
        that.props.updateDetetedLesson(res.lesson_date_times);
      }
    });
    // this.props.updateLesson(this.props.lessonDateTime.id, dataToUpdate);
  }

  createOptions(status,field){
    return <option value={status.id} key={status.id}>{status[field]}</option>
  }

  createOptionsStudent(status){
    return <option value={status.id} key={status.id}>{status.student_name}</option>
  }

  selectStudent(e,initialValue){
    var that = this;
    var lessonStudents = this.state.lessonStudents;
    var lessonStudentArray = this.state.lessonStudentArray;
    var lessonPeopleStates = this.state.lessonPeopleStates;
    var options = initialValue ? initialValue : $(e.target).val();
    _.each(options, function (option, key1) {
      _.find(that.props.students, function (value, key) {
          if(value.id == option && !lessonStudents[value.id]){ 
            lessonStudents[value.id] = value
            if(!initialValue){
              lessonStudentArray[value.id] = {paid: 0, enrollment_status_id: null,
                                            horse_id: null, student_id: null }
              lessonPeopleStates.push({student_id: value.id, paid: 0})

            }
          }
      });
    });

    setTimeout(()=>{
      $('.selectpicker').selectpicker();
      $('.check-mark').on('click',function(e){
        var lessonStudents = that.state.lessonStudents;
        var lessonPeopleStates = this.state.lessonPeopleStates;
        var studentId = $(e.target).parent().attr('class');
        delete lessonStudents[studentId];
        that.setState({lessonStudents: lessonStudents });
        var students = _.remove(lessonPeopleStates, function(stu) {
          return stu.student_id == studentId;
        });
        this.setState({lessonPeopleStates: lessonPeopleStates});
      })

      if(initialValue){
        $('.selectpickerStudents').selectpicker('val',initialValue);
      }

     _.each(lessonStudents, function(value,key){
        if(options && options.indexOf(key) == -1 && !initialValue){
          delete lessonStudents[key]
          delete lessonStudentArray[key]
        }
      });

      if(initialValue && this.props.lessonDateTime && this.props.lessonDateTime.lesson_people){
        _.each(this.props.lessonDateTime.lesson_people, function(val, key){
          lessonStudentArray[val.student_id] = {paid: val.paid, enrollment_status_id: val.enrollment_status_id,
                                          horse_id: val.horse_id, student_id: val.student_id }
        })
      }
      if(!options){
        lessonStudentArray = {};
        lessonPeopleStates = [];
        lessonStudents = {};
      }
      this.setState({lessonStudents: lessonStudents,
        lessonStudentArray: lessonStudentArray, lessonPeopleStates: lessonPeopleStates });
    },100)

    if(!initialValue){
      setTimeout(()=>{
        $('.selectpicker').selectpicker();
      },500)
    }

  }

  getSelectedHourseId(student, field){
    var selectedField = "";
    _.each(this.state.lessonPeopleStates, function(people){
      if(student.id == people.student_id){
        selectedField = people[field];
      }
    })
    return selectedField;
  }

  getSelectedPaidStatus(student){
    var selectedField = "";
    _.each(this.state.lessonPeopleStates, function(people){
      if(student.id == people.student_id){
        selectedField = people.paid;
      }
    })
    return selectedField;
  }

  getSelectedStudent(student){
    var selectedField = "a";
    _.each(this.state.lessonPeopleStates, function(people){
      if(student.id == people.student_id){
        selectedField = people.enrollment_status_id;
      }
    });
    return selectedField;
  }

  removeStudent(e,student){
    var studentData = this.state.lessonStudents;
    delete studentData[student];
    var lessonStudentArray = this.state.lessonStudentArray;
    delete studentData[student];
    delete lessonStudentArray[student];
    $('.selectpickerStudents').find('[value='+student+']').remove();
    $('.selectpickerStudents').selectpicker('refresh');
    this.setState({lessonStudents: studentData, lessonStudentArray: lessonStudentArray})
  }

  createHorsesList(horse){
    return <option value={horse.id} key={horse.id}>{horse.horse_name}</option>    
  }

  createenrollmentStatusesList(status){
    return <option value={status.id} key={status.id}>{status.enrollment_status_name}</option>    
  }

  addHorseToLesson(initialData, e){
    var that = this;
    var selectedHorses = this.state.selectedHorses;
    var selectedValues = initialData ? e : $(e.target).val();
    _.each(selectedValues, function (horse, key1) {
      _.find(that.props.horses, function (value, key) {
          if(value.id == horse){ 
            selectedHorses[horse] = value
          }
      });
    });

    _.each(selectedHorses, function(value,key){
      if(selectedValues && selectedValues.indexOf(key) == -1){
        delete selectedHorses[key]
      }
    })
    selectedHorses = selectedValues ? selectedHorses : {};
    this.setState({selectedHorses: selectedHorses});
    if(initialData){
      setTimeout(()=>{
        $('.selectpickerLessonHorse').selectpicker('val',selectedValues);
      },300);
    }
  }

  removeHourse(e,horseId){
    var selectedHorses = this.state.selectedHorses;
    delete selectedHorses[horseId];
    this.setState({selectedHorses: selectedHorses});
    $('.selectpickerLessonHorse').find('[value='+horseId+']').remove();
    $('.selectpickerLessonHorse').selectpicker('refresh');
  }

  editScheduledStartDate(date){
    this.setState({scheduledStartDate: date, endMinDate: date, scheduledEndDate: date})
  }

  editScheduledEndDate(date){
    this.setState({scheduledEndDate: date})
  }

  startTimeChange(time){
    this.setState({startTime: time})    
  }

  endTimeChange(time){
    this.setState({endTime: moment(time._d)})     
  }


  discardChanges(e){
    // var that = this;
    // Api.get('/lesson_date_times/'+148).then(function(res,err){
    //   console.log('yyyyyyyyyy',res.lesson_date_time) 
    //   that.setState({lessonDateTime: res.lesson_date_time, initialData: res.lesson_date_time})
    // });
    // console.log('aaaaaaaaaa',this.props.lessonDateTime)
  }

  changeLocation(e, location){
    this.setState({locationId: location})
  }

  lessonHorseList(horse){
    return <div className="snglClDtl" key={horse.id}>
            <div className="clntNmeImg">
              <div className="clientImg"><img src="assets/clientImage.png" alt="Client Image" /></div>
                <div className="clntName">{horse.horse_name}</div>
              </div>
            <div className="adhCross" onClick={(e)=> {this.removeHourse(e, horse.id)}}>
          <button></button>
      </div>
    </div>
  }

  createLocationList(location){
    return <div key={location.id} className="snglChck"><label>{location.location_name}
    <input checked={this.state.locationId == location.id} onChange={(e)=>{this.changeLocation(e, location.id)}} type="radio" name="location" /><span></span></label></div>
  }

  createStudentLessonList(student){
    var selectedHourse = this.getSelectedHourseId(student,'horse_id');
    var selectedEnrollStatus = this.getSelectedStudent(student);
    var paidStatus = this.getSelectedPaidStatus(student);
    var horses = _.map(this.props.horses, this.createHorsesList);
    var enrollmentStatuses = _.map(this.props.enrollmentStatuses, this.createenrollmentStatusesList);
    paidStatus = paidStatus == 0 ? false : true;

    return <div className="snglClDtl" key={student.id}>
          <div className="clntNmeImg">
            <div className="clientImg red_clnt"></div>
            <div className="clntName">{student.student_name}</div>
          </div>
          <div className="adhCross" onClick={(e) =>{this.removeStudent(e,student.id)}}>
            <button></button>
          </div>
          <div className="psaCnt">
            <div className="psacInr">
              <div className="paidUnpaidChk">
                <label>Paid</label>
                  <div className="cstmChck">
                    <label>
                      <input type="checkbox" defaultValue={paidStatus} onChange={(e) => 
                        {this.changePaidStatus(e, student.id)}} checked={paidStatus}/>
                      <span></span>
                    </label>
                  </div>
                </div>
              <div className="slct_cnt dblSelect clearfix">
                <div className="snglFld">
                  <label>Status</label>
                    <select className="selectpicker" onChange={(e) => {this.changeEnStatus(e,student.id)}} defaultValue={selectedEnrollStatus}>
                      <option value="">Select Status</option>
                      {enrollmentStatuses}
                    </select>
                </div>
                <div className="snglFld">
                  <label>Assigned to</label>
                    <select className="selectpicker" onChange={(e) => {this.changeHourse(e,student.id)}} defaultValue={selectedHourse}>
                      <option value="">Select Horse</option>
                      {horses}
                    </select>
                </div>
              </div>
          </div>
        </div>
      </div>
  }

  render() {
    var lessonDetail = this.props.lessonDateTime;
    var that = this;
    var lessonStatus = _.map(this.props.lesson_status, (data)=>{ return this.createOptions(data,'lesson_status_name')});
    var sections = _.map(this.props.sections , (data)=>{ return this.createOptions(data,'section_name')});
    var instructors = _.map(this.props.instructors, (data)=>{ return this.createOptions(data,'instructor_name')});
    var students = _.map(this.props.students, this.createOptionsStudent);
    var lessonStudentList = _.map(this.state.lessonStudents, this.createStudentLessonList);
    var horses = _.map(this.props.horses, this.createHorsesList);
    var lessonHorses = _.map(this.state.selectedHorses, this.lessonHorseList);
    var locations = _.map(this.props.locations, this.createLocationList);

      return (
        <div>
          { lessonDetail &&
            <AtomicForm ref="editLessonForm" initialData={this.state.initialData} 
              doSubmit={this.doSubmit} afterValidation={this.afterValidation}
              >
            <div className="blgCnt blgFull grayBg">
              <div className="blgCntInr">
                <button id="closepopover" type="button" className="close" aria-hidden="true" onClick={this.props.hideModal}>&times;</button>
                <div className="topOrngStrip"></div>
                <div className="blgFullCntnr">
                  <div className="bglHead">
                    <h1>
                      <span>Beginner Lesson Group 1</span>
                      <div className="blgHeadDrop">
                        <div className="dropdown">
                          <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></button>
                          <ul className="dropdown-menu">
                            <li><a href="javascript:void(0)" onClick={(e)=>{this.duplicateLesson(e)}}>Duplicate lesson</a></li>
                            {lessonDetail.is_recuring &&
                              <li><a href="javascript:void(0)" onClick={(e)=>{ this.deleteLesson(e, 'single') }}>Delete Only This Occurrence </a></li>
                            }
                            {lessonDetail.is_recuring && 
                              <li><a href="javascript:void(0)" onClick={(e)=>{ this.deleteLesson(e,'true') }}>Delete All In Series</a></li>
                            }
                            {lessonDetail.is_recuring &&
                              <li><a href="javascript:void(0)" onClick={(e)=>{ this.deleteLesson(e,'future') }}>Delete All Future lessons</a></li>
                            }
                            {!lessonDetail.is_recuring &&
                              <li><a href="javascript:void(0)" onClick={(e)=>{ this.deleteLesson(e,null) }}>Delete Lesson</a></li>
                            }
                          </ul>
                        </div>
                      </div>
                    </h1>
                  </div>
                  <div className="snglBlck">
                    <div className="blckHead">Lesson details</div>
                    <div className="popBody">
                      <div className="snglFld">
                        <label>Lesson name</label>
                        <input type="text" ref="name" validate={
                        [{
                        message: "Name is required",
                        validate: "isPresent",
                        }]}/>
                        {this.validationMessage("name")}
                      </div>
                      <div className="slct_cnt">
                        <div className="snglFld">
                          <label>Status</label>
                          <select className="selectpicker" ref="lesson_status_id">
                            <option value="">Select Lesson Status </option>
                            {lessonStatus}
                          </select>
                        </div>
                      </div>
                      <div className="slct_cnt">
                        <div className="snglFld">
                          <label>Section</label>
                          <select className="selectpicker" ref="section_id" validate={
                            [{
                              message: "Section is required",
                              validate: "isPresent",
                              }
                            ]}>
                            {sections}
                          </select>
                          {this.validationMessage("section_id")}
                        </div>
                      </div>
                      <div className="slct_cnt">
                        <div className="snglFld">
                          <label>Instructor</label>
                          <select className="selectpicker" ref="instructor_id" validate={
                            [{
                              message: "Instructor is required",
                              validate: "isPresent",
                              }
                            ]}>
                            <option>Select Instructor </option>
                            {instructors}
                          </select>
                          {this.validationMessage("instructor_id")}
                        </div>
                      </div>
                      <div className="snglFld">
                        <label>Location</label>
                          {locations}
                      </div>
                    </div>
                  </div>
                  <div className="snglBlck">
                    <div className="blckHead">Date and time</div>
                    <div className="popBody">
                      <div className="slct_cnt dblSelect clearfix">
                        <label>Starts</label>
                        <div className="snglFld">
                        <DatePicker
                           selected={this.state.scheduledStartDate}
                           onChange={this.editScheduledStartDate}
                           dateFormat="MMMM DD , YYYY"
                           minDate='0'
                        />
                        </div>
                        <div className="snglFld input-group bootstrap-timepicker timepicker">
                         <TimePicker 
                          format="hh:mm A"
                          showSecond={false}
                          onChange={this.startTimeChange}
                          value={this.state.startTime}
                          use12Hours={true}
                          className="starttimepicker"
                          popupClassName="starttimepickerpopup"
                          allowEmpty={false}
                         />
                        </div>
                      </div>
                      <div className="slct_cnt dblSelect clearfix">
                        <label>Ends</label>
                        <div className="snglFld">
                        <DatePicker
                           selected={this.state.scheduledEndDate}
                           onChange={this.editScheduledEndDate}
                           dateFormat="MMMM DD , YYYY"
                           minDate={this.state.endMinDate}

                        />
                        </div>
                        <div className="snglFld input-group bootstrap-timepicker timepicker">
                          <TimePicker 
                          format="hh:mm A"
                          showSecond={false}
                          onChange={this.endTimeChange}
                          defaultValue={this.state.endTime}
                          use12Hours={true}
                          className="endtimepicker"
                          popupClassName="endtimepickerpopup"
                          allowEmpty={false}
                          value={this.state.endTime}
                         />
                        </div>
                      </div>
                      <div className="snglFld">
                        <label>Is this lesson recurring</label>
                        <div className="snglChck">
                          <label>
                          NO
                          <input type="radio" name="rcrng1" checked={this.state.isRecuring == false}/> 
                          <span></span>
                          </label>
                        </div>
                        <div className="snglChck">
                          <label>
                          YES
                          <input type="radio" name="rcrng1" checked={this.state.isRecuring == true}/> 
                          <span></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="snglBlck">
                    <div className="blckHead">Lesson horses</div>
                    <div className="popBody">
                      <div className="slct_cnt">
                        <div className="snglFld">
                          <label>Add horse to lesson</label>
                          <select className="selectpicker selectpickerLessonHorse" multiple onChange={(e)=> this.addHorseToLesson(false, e) }>
                            {horses}
                          </select>
                        </div>
                      </div>
                      <div className="addedHrse">
                        <div className="adhInr">
                          {lessonHorses}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="snglBlck">
                    <div className="blckHead">Lesson attendees</div>
                    <div className="popBody">
                      <div className="slct_cnt">
                        <div className="snglFld">
                          <label>Add client to lesson</label>
                            <select className="selectpicker selectpickerStudents" multiple onChange={(e)=> {this.selectStudent(e, false)}}>
                              {students}
                            </select>
                        </div>
                      </div>
                      <div className="addedHrse">
                        <div className="adhInr">
                          {lessonStudentList}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="snglBlck">
                    <div className="blckHead">LESSON NOTES</div>
                    <div className="popBody">
                      <div className="lnText">    
                        <label>Add a note visible to client and staff assigned to this lesson (optional)</label>
                        <textarea rows="6" ref="lesson_notes"></textarea>
                      </div>
                    </div>
                  </div>
                  {lessonDetail.series &&
                    <div className="snglBlck">
                      <div className="blckHead">EDIT RECURING LESSS</div>
                      <div className="popBody">
                        <div className="snglFld">
                          <label>Select edit option</label>
                          <div className="snglChck">
                            <label>
                            Update Only This Occurrence
                            <input type="radio" name="recurring-update" value="current_occurrence" checked={this.state.recurring_update_option == 'current_occurrence'} onChange={(e)=>{this.setRecuringUpdate(e)}}/> 
                            <span></span>
                            </label>
                          </div>
                          <div className="snglChck">
                            <label>
                            Update All Occurrences
                            <input type="radio" name="recurring-update" value="all_occurrence" checked={this.state.recurring_update_option == 'all_occurrence'} onChange={(e)=>{this.setRecuringUpdate(e)}}/> 
                            <span></span>
                            </label>
                          </div>

                          <div className="snglChck">
                            <label>
                            Update All Future Occurrences
                            <input type="radio" name="recurring-update" value="future_occurrence" checked={this.state.recurring_update_option == 'future_occurrence'} onChange={(e)=>{this.setRecuringUpdate(e)}}/> 
                            <span></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  }

                  <div className="btmBtns">
                    <div className="bbsnglBtn primaryBtn">
                        <button type="submit">Save changes</button>
                    </div>
                    <div className="bbsnglBtn orangeBtn">
                        <button type="submit" onClick={(e)=> {this.duplicateLesson(e)}}>Duplicate Lesson</button>
                    </div>
                    <div className="bbsnglBtn defaultBtn">
                       {/* <a href="javascript:void(0)" onClick={(e)=> {this.discardChanges(e) }}>Discard changes</a>*/}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AtomicForm>
          }
        </div>
      );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    lessonDateTime: state.lessonDateTime,
    lesson_status: state.lesson_status,
    sections: state.sections,
    instructors: state.instructors,
    students: state.students,
    horses: state.horses,
    enrollmentStatuses: state.enrollment_statuses,
    lessonPeople: state.lessonPeople,
    lessonHorses: state.lessonHorses,
    locations: state.locations
  }
};

function matchDispatchToProps(dispatch){
    return bindActionCreators({getLocations: getLocations,
    getLessonStatus: getLessonStatus,getSections: getSections, 
    getInstructors: getInstructors, getStudents: getStudents,
    addLesson: LessonAction.addLesson,getLessons :LessonAction.getLessons,
    getLesson: LessonAction.getLesson, getStudent: LessonAction.getStudent,
    getHorses: LessonAction.getHorses, 
    getEnrollmentStatuses: LessonAction.getEnrollmentStatuses,
    getLessonPeople:  LessonAction.getLessonPeople,
    updateLesson: LessonAction.updateLesson,
    deleteLesson: LessonAction.deleteLesson },dispatch);
}


export default connect(mapStateToProps, matchDispatchToProps)(EditModalTemplate);
