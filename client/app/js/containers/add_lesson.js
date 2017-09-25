import React, {Component}           from 'react';
import {connect}                    from 'react-redux';
import  LessonAction                from '../actions/lesson';
import { bindActionCreators }       from 'redux';
import BaseComponent                from '../components/base_component';
import DatePicker                   from 'react-datepicker';
import TimePicker                   from 'rc-time-picker';
import moment                       from 'moment';
import AtomicForm                   from "atomic-form";
import { getSections }              from '../actions/section';
import { getInstructors }           from '../actions/instructor';
import { getLocations }             from '../actions/location';
import 'react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';
const RepeatDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

class AddLesson extends BaseComponent {
    
  constructor(props, context){
    super(props, context);
    this.state={initialData: {}, startTime: props.startTime || moment(new Date()), 
      endTime: props.endTime || moment(new Date()),
      scheduledStartDate:  props.scheduledStartDate || moment(new Date()),
      scheduledEndDate: props.scheduledEndDate || moment(new Date()),
      isRecuring: false, period: 'day',frequency: 1,
      repeatTime: 1, selectedHorses: {}, lessonStudents: {},
      lessonStudentArray:{}, repeatStart: moment(new Date()),
      repeatEnd: 'on',
      endRepeatDate: moment(new Date()).add(1, 'days'),
      endRepeatMinDate: moment(new Date()).add(1, 'days'),
      weekDays: [], studentCopied: false}

    this._bind('addScheduledStartDate','addScheduledEndDate','endTimeChange',
      'startTimeChange','afterValidation','doSubmit','createLocationList',
      'changeRecuring','changeLocation','selectRepeat','selectRepeatEvery',
      'fillMoreDetails','addHorseToLesson','lessonHorseList','removeHourse',
      'selectStudent','createStudentLessonList','changeEnStatus',
      'changeHourse','changePaidStatus','updateStudentAssingStatus',
      'changeRepeatStartDate','changeRepeatEndDate','endRepeatOccurance',
      'changeEndRepeatDate','addWeekDays','shouldStudentCopied');
  }

  componentWillMount(){
  	this.setState({locationId: this.props.locations ? this.props.locations[0].id : null});
  }

  componentDidMount(){
    setTimeout(()=>{
      $('.selectpicker').selectpicker();
    },100);
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      startTime: nextProps.calenderClicked ? nextProps.startTime : moment(new Date()), 
      endTime: nextProps.calenderClicked ? nextProps.endTime : moment(new Date()), 
      scheduledStartDate:  nextProps.calenderClicked ? nextProps.scheduledStartDate : moment(new Date()),
      scheduledEndDate: nextProps.calenderClicked ? nextProps.scheduledEndDate : moment(new Date()),
      locationId: nextProps.locations ? nextProps.locations[0].id : 0
    });
  }

  doSubmit(formData){
  	var that = this;
    var data = {lesson_date_time: {
      name: formData.name,
      section_id: formData.section_id,
      instructor_id: formData.instructor_id,
      scheduled_starttime: this.state.startTime.toLocaleString(),
      scheduled_endtime: this.state.endTime.toLocaleString(),
      scheduled_end_date: this.state.scheduledEndDate.toLocaleString(),
      scheduled_date: this.state.scheduledStartDate.toLocaleString(),
      location_id: this.state.locationId,
      is_recuring: this.state.isRecuring,
      lesson_notes: formData.lesson_notes
    }};

    if(this.state.isRecuring){
      data.lesson_date_time.period    = this.state.period
      data.lesson_date_time.frequency = this.state.frequency
      data.lesson_date_time.starttime = this.state.repeatStart._d
      data.lesson_date_time.endtime   =  this.state.endRepeatDate._d
      data.lesson_date_time.repeat_end_status = this.state.repeatEnd
      data.lesson_date_time.occurence = this.state.occurenceVal
      data.lesson_date_time.week_recuring_days = this.state.weekDays
      data.lesson_date_time.is_data_copied = this.state.studentCopied
    }

    if(this.state.extraLessonDetail){
	   	var studentData = [];
	    _.each(this.state.lessonStudentArray, function(value,key){
	      value['student_id'] = key
	      studentData.push(value)
	    });

      if(Object.keys(this.state.selectedHorses).length){
        var lessonHorse = [];
        _.each(this.state.selectedHorses, function(value,key){
          lessonHorse.push({horse_id: key})
        });
        data['lesson_date_time']['lesson_date_time_horses_attributes'] = lessonHorse;
      }
      data['lesson_date_time']['lesson_people_attributes'] = studentData;
    }
    this.props.addLesson(data);
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

  afterValidation(formValidations) {
    this.setState({validations: formValidations});
  }

  addScheduledStartDate(date){
    if(date){
      this.setState({scheduledStartDate: date, endMinDate: date, scheduledEndDate: date})
    }
  }

  addScheduledEndDate(date){
    this.setState({scheduledEndDate: date});
  }

  changeEndRepeatDate(date){
    this.setState({endRepeatDate: date});
  }

  startTimeChange(time){
    if(time){
      this.setState({startTime: moment(time._d)});
    }  
  }

  endTimeChange(time){
    if(time){
      this.setState({endTime: moment(time._d)}) 
    }    
  }

  changeRecuring(e,val){
    this.setState({isRecuring: val});
    setTimeout(()=>{
      $('.selectpickerRecuring').selectpicker()
    },100)
  }

  changeLocation(e, location){
    this.setState({locationId: location});
  }

  selectRepeat(e){
    this.setState({period: e.target.value});
  }

  selectRepeatEvery(e){
    this.setState({frequency: e.target.value});
  }

  selectRepeatTime(e){
    this.setState({repeatTime: e.target.value}) 
  }

  fillMoreDetails(e){
    if(!this.state.extraLessonDetail){
      e.preventDefault();
    }

  	this.setState({extraLessonDetail: true});
  	setTimeout(()=>{
      $('.selectpickerLessonHorse, .selectpickerStudents').selectpicker();
    },200);
  }

  addHorseToLesson(e){
    var that = this;
    var selectedHorses = this.state.selectedHorses;
    var selectedValues = $(e.target).val();
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
  };

  changeEnStatus(e, student){
    var data = this.state.lessonStudentArray;
    var horse_id = data[student] && data[student]['horse_id'] ? data[student]['horse_id'] : null;
    var paid = data[student] && data[student]['paid'] ? data[student]['paid'] : false;
    data[student] = {enrollment_status_id: e.target.value, horse_id: horse_id, paid: paid};
    var lessonArray = this.updateStudentAssingStatus(student, 'enrollment_status_id', e.target.value);
    this.setState({lessonStudentArray: data, lessonPeopleStates: lessonArray})
  };

  changeHourse(e, student){
    var data = this.state.lessonStudentArray;
    var enrollment_status_id = data[student] && data[student]['enrollment_status_id'] ? data[student]['enrollment_status_id'] : null;
    var paid = data[student] && data[student]['paid'] ? data[student]['paid'] : false;
    data[student] = {horse_id: e.target.value, enrollment_status_id: enrollment_status_id, paid: paid}
    var lessonArray = this.updateStudentAssingStatus(student, 'horse_id', e.target.value);
    this.setState({lessonStudentArray: data, lessonPeopleStates: lessonArray})
  };

  changePaidStatus(e, student){
    var data = this.state.lessonStudentArray;
    var isChecked = e.target.checked ? 1 : 0;
    var enrollment_status_id = data[student] && data[student]['enrollment_status_id'] ? data[student]['enrollment_status_id'] : null;
    var horse_id = data[student] && data[student]['horse_id'] ? data[student]['horse_id'] : null;
    data[student] = {horse_id: horse_id, enrollment_status_id: enrollment_status_id, paid: isChecked}
    var lessonPeopleStates = this.state.lessonPeopleStates;
    var lessonArray = this.updateStudentAssingStatus(student, 'paid', isChecked);
    this.setState({lessonStudentArray: data, lessonPeopleStates: lessonArray})
  };

  updateStudentAssingStatus(student, field, val){
    var lessonArray = [];
    _.each(this.state.lessonPeopleStates, function(lesson){
      if(lesson.student_id == student){
        lesson[field] = val
      }
      lessonArray.push(lesson);
    });
    return lessonArray;
  };

  selectStudent(e){
    var that = this;
    var lessonStudents = this.state.lessonStudents;
    var lessonStudentArray = this.state.lessonStudentArray;

    var options = $(e.target).val();
    _.each(options, function (option, key1) {
      _.find(that.props.students, function (value, key) {
          if(value.id == option && !lessonStudents[value.id]){ 
            lessonStudents[value.id] = value
            lessonStudentArray[value.id] = {paid: 0, enrollment_status_id: null,
                                            horse_id: null, student_id:null }
          }
      });
    });

    setTimeout(()=>{
      $('.selectpicker').selectpicker();
      $('.check-mark').on('click',function(e){
        var lessonStudents = that.state.lessonStudents;
        var studentId = $(e.target).parent().attr('class');
        delete lessonStudents[studentId];
        that.setState({lessonStudents: lessonStudents });
      });

     _.each(lessonStudents, function(value,key){
        if(options && options.indexOf(key) == -1){
          delete lessonStudents[key]
        }
      });
     if(!options){
     	lessonStudents={}
     }

      this.setState({lessonStudents: lessonStudents, lessonStudentArray: lessonStudentArray });
      $('.selectpicker').selectpicker();
    },200);
  };

  removeStudent(e,student){
    var studentData = this.state.lessonStudents;
    delete studentData[student];
    var lessonStudentArray = this.state.lessonStudentArray;
    delete studentData[student];
    delete lessonStudentArray[student];
    $('.selectpickerStudents').find('[value='+student+']').remove();
    $('.selectpickerStudents').selectpicker('refresh');
    this.setState({lessonStudents: studentData, lessonStudentArray: lessonStudentArray})
  };

  addWeekDays(e){
    var checked = e.target.checked;
    var val = e.target.value;
    var weekDays = this.state.weekDays;
    var index = weekDays.indexOf(val);
    if(index == -1 && checked){
        weekDays.push(val)
    }else{
      weekDays.splice(index, 1)
    }
    this.setState({weekDays: weekDays})
  };

  shouldStudentCopied(e, val){
    this.setState({studentCopied: val});
  };

  createOptions(data, field){
    return <option value={data.id} key={data.id}>{data[field]}</option> 
  };

  createLocationList(location){
    return <div key={location.id} className="snglChck"><label>{location.location_name}
    <input checked={this.state.locationId == location.id} onChange={(e)=>{this.changeLocation(e, location.id)}} type="radio" name="location" /><span></span></label></div>
  };

  createRepeatOptions(times){
    return  _.range(1, times).map(value => <option key={value} value={value}>{value}</option>)
  };

  dayCheckBoxes(times){
    return  _.range(0, times).map((value,key) => <div key={key} className="cbSngl"><label><p>{RepeatDays[key]}</p><input type="checkbox" value={key} onChange={(e)=>{this.addWeekDays(e)}}/><span></span></label></div>)
  };

  createHorsesList(horse){
    return <option value={horse.id} key={horse.id}>{horse.horse_name}</option>    
  };

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
  };

  removeHourse(e,horseId){
    var selectedHorses = this.state.selectedHorses;
    delete selectedHorses[horseId];
    this.setState({selectedHorses: selectedHorses});
    $('.selectpickerLessonHorse').find('[value='+horseId+']').remove();
    $('.selectpickerLessonHorse').selectpicker('refresh');
  };

  createOptionsStudent(status){
    return <option value={status.id} key={status.id}>{status.student_name}</option>
  };

  createenrollmentStatusesList(status){
    return <option value={status.id} key={status.id}>{status.enrollment_status_name}</option>    
  };

  changeRepeatStartDate(date){
    this.setState({repeatStart: date, endRepeatDate: date, endRepeatMinDate: date});
  };

  changeRepeatEndDate(e){
    this.setState({repeatEnd: e.target.value});
  };

  endRepeatOccurance(e){
   var occurenceVal = 1;
   const re = /^[0-9\b]+$/;
    if (e.target.value == '' || re.test(e.target.value)) {
     occurenceVal = e.target.value
    }
    this.setState({occurenceVal: occurenceVal});
  };

  createStudentLessonList(student){
    var horses = _.map(this.props.horses, this.createHorsesList);
    var enrollmentStatuses = _.map(this.props.enrollmentStatuses, this.createenrollmentStatusesList);

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
                      <input type="checkbox" onChange={(e) => 
                        {this.changePaidStatus(e, student.id)}}/>
                      <span></span>
                    </label>
                  </div>
                </div>
              <div className="slct_cnt dblSelect clearfix">
                <div className="snglFld">
                  <label>Status</label>
                    <select className="selectpicker" onChange={(e) => {this.changeEnStatus(e,student.id)}}>
                      <option value="">Select Status</option>
                      {enrollmentStatuses}
                    </select>
                </div>
                <div className="snglFld">
                  <label>Assigned to</label>
                    <select className="selectpicker" onChange={(e) => {this.changeHourse(e,student.id)}}>
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
    var locations = _.map(this.props.locations, this.createLocationList);
    var sections = _.map(this.props.sections, (data)=>{ return this.createOptions(data,'section_name')});
    var instructors = _.map(this.props.instructors, (data)=>{ return this.createOptions(data,'instructor_name')});
    var horses = _.map(this.props.horses, this.createHorsesList);
    var lessonHorses = _.map(this.state.selectedHorses, this.lessonHorseList);
    var students = _.map(this.props.students, this.createOptionsStudent);
    var lessonStudentList = _.map(this.state.lessonStudents, this.createStudentLessonList);

    return (
      <div className="addLsnPop">
        <AtomicForm ref="editLessonForm" initialData={this.state.initialData} 
              doSubmit={this.doSubmit} afterValidation={this.afterValidation}
                >
          <div className="alpInr">
            <div className="popHead">
              <h2>Add a lesson</h2>
            </div>
            <div className="closePop" onClick={()=>{this.props.closeModal()}}><span></span></div>
            <div className="popBody">
              <div className="snglFld">
                <label>Section</label>
                <select className="selectpicker" ref="section_id" validate={
                  [{
                    message: "Section is required",
                    validate: "isPresent",
                    }
                  ]}>
                  <option>Select Section</option>
                  {sections}
                </select>
                {this.validationMessage("section_id")}
              </div>
              <div className="snglFld">
                <label>Lesson name</label>
                <input type="text" ref="name" validate={[{
                  message: "Name is required",
                  validate: "isPresent",
                  }]}/>
                {this.validationMessage("name")}
              </div>
              <div className="slct_cnt dblSelect clearfix">
                <label>Starts</label>
                <div className="snglFld">
                  <DatePicker
                    selected={this.state.scheduledStartDate}
                    onChange={this.addScheduledStartDate}
                    dateFormat="MMMM DD , YYYY"
                    minDate='0'
                    ref="startDate"
                    readOnly={true}
                   />
                </div>
                <div className="snglFld">
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
                   onChange={this.addScheduledEndDate}
                   dateFormat="MMMM DD , YYYY"
                   minDate={this.state.endMinDate}
                   readOnly={true}
                   validate={[{
                     message: "End date is required",
                      validate: "isPresent",
                    }]}/>
                    {this.validationMessage("endDate")}
                </div>
                <div className="snglFld">
                  <TimePicker 
                    format="hh:mm A"
                    showSecond={false}
                    onChange={this.endTimeChange}
                    value={this.state.endTime}
                    use12Hours={true}
                    className="endtimepicker"
                    popupClassName="endtimepickerpopup"
                    allowEmpty={false}
                    />
                </div>
              </div>
              <div className="snglFld">
                <label>Is this lesson recurring</label>
                <div className="snglChck">
                  <label>
                  NO<input type="radio" checked={this.state.isRecuring == false} name="rcrng" onChange={(e)=>{this.changeRecuring(e, false)}}/>
                  <span></span>
                  </label>
                </div>
                <div className="snglChck">
                  <label>
                  YES<input type="radio" checked={this.state.isRecuring == true} name="rcrng" onChange={(e)=>{this.changeRecuring(e, true)}}/>
                  <span></span>
                  </label>
                </div>
              </div>
              {this.state.isRecuring &&
                <div className="rcrngYes">
                  <div className="slct_cnt dblSelect clearfix">
                    <label>Lesson repeats</label>
                    <div className="snglFld">
                      <select value={this.state.period} className="selectpicker selectpickerRecuring" onChange={(e)=> {this.selectRepeat(e)}}>
                        <option value="day">Daily</option>
                        <option value="week">Weekly</option>
                      </select>
                    </div>
                  </div>
                  <div className="slct_cnt dblSelect clearfix">
                    <label>Repeat every</label>
                    <div className="snglFld">
                      <select value={this.state.frequency} className="selectpicker selectpickerRecuring" onChange={(e)=> {this.selectRepeatEvery(e)}}>
                      {this.createRepeatOptions(31)}
                      </select>
                    </div>
                  </div>
                  {this.state.period == 'week' &&
                  <div className="slct_cnt dblSelect clearfix">
                    <label>On these days of week</label>
                    <div className="chkbxCnt">
                      {this.dayCheckBoxes(7)}
                    </div>
                  </div>
                  }
                  <div className="slct_cnt dblSelect clearfix">
                    <label>Starts repeat on</label>
                    <div className="snglFld">
                      <DatePicker selected={this.state.repeatStart} onChange={this.changeRepeatStartDate} dateFormat="MMMM DD , YYYY" readOnly={true} />
                    </div>
                  </div>
                  <div className="rcrngRdo">
                    <label>Ends repeat</label>
                    <div className="snglFld">
                      <div className="snglChck">
                        <label>
                          <p>Never</p>
                          <input type="radio" name="repeat" value="never"
                          onChange={(e)=>{this.changeRepeatEndDate(e)}} checked={this.state.repeatEnd == 'never'}/>
                          <span></span>
                        </label>
                      </div>
                    </div>
                    <div className="snglFld">
                      <div className="snglChck">
                        <label>
                          <input type="radio" name="repeat" value="after"
                          onChange={(e)=>{this.changeRepeatEndDate(e)}} checked={this.state.repeatEnd == 'after'}/>
                          <span></span>
                        </label>
                        <div className="aftrOcnc">
                          <span>After</span> {this.state.repeatEnd == 'after' &&
                          <div className="aoInpt">
                            <input type="text" value={this.state.occurenceVal} onChange={(e)=>{this.endRepeatOccurance(e)}}/>
                          </div>
                          }
                          <span>Occurences</span>
                        </div>
                      </div>
                    </div>
                    <div className="snglFld">
                      <div className="snglChck">
                        <label>
                          <input type="radio" name="repeat" value="on" 
                          onChange={(e)=>{this.changeRepeatEndDate(e)}} checked={this.state.repeatEnd == 'on'}/>
                          <span></span>
                        </label>
                        <div className="aftrOcnc">
                          <span>On</span>
                          <div className="slct_cnt">
                            <div className="snglFld">
                              {this.state.repeatEnd == 'on' &&
                              <DatePicker selected={this.state.endRepeatDate} onChange={this.changeEndRepeatDate} dateFormat="MMMM DD , YYYY" minDate={this.state.endRepeatMinDate} readOnly={true} /> }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="snglFld">
                      <label>Current students and horses also should be copied ?</label>
                      <div className="snglChck">
                        <label>
                        NO<input type="radio" checked={this.state.studentCopied == false} name="stucp" onChange={(e)=>{this.shouldStudentCopied(e, false)}}/>
                        <span></span>
                        </label>
                      </div>
                      <div className="snglChck">
                        <label>
                        YES<input type="radio" checked={this.state.studentCopied == true} name="stucp" onChange={(e)=>{this.shouldStudentCopied(e, true)}}/>
                        <span></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              }
              <div className="slct_cnt clearfix">
                <label>Instructor</label>
                <div className="snglFld">
                  <select className="selectpicker" ref="instructor_id" validate={
                  [{
                    message: "Instructor is required",
                    validate: "isPresent",
                    }
                  ]}>
                  <option>Select Instructor</option>
                  {instructors}
                </select>
                {this.validationMessage("instructor_id")}
                </div>
              </div>
              <div className="snglFld">
                <label>Location</label>
                {locations}
              </div>
              <div className="snglFld">
                {this.state.extraLessonDetail &&
  	              <div>
  									<div className="snglBlck">
  									  <div className="blckHead">Lesson horses</div>
  									  <div className="popBody">
  									    <div className="slct_cnt">
  									      <div className="snglFld">
  									        <label>Add horse to lesson</label>
  									        <select className="selectpicker selectpickerLessonHorse" multiple onChange={(e)=> this.addHorseToLesson(e) }> 
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
  									        <select className="selectpicker selectpickerStudents" multiple onChange={(e)=> {this.selectStudent(e)}}>
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
  								</div>
  							}
              <div className="btmBtns">
                <div className="bbsnglBtn primaryBtn">
                  <button type="submit" onClick={(e)=>{this.fillMoreDetails(e)}}>Fill in lesson details</button>
                </div>
                <div className="bbsnglBtn orangeBtn">
                  <button type="submit">Add lesson and fill in details later</button>
                </div>
                <div className="bbsnglBtn defaultBtn">
                  <a href="javascript:void(0)" onClick={(e)=> this.props.closeModal()}>Cancel</a>
                </div>
              </div>
            </div>

            </div>
          </div>
        </AtomicForm>
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    sections: state.sections,
    instructors: state.instructors,
    locations: state.locations,
    horses: state.horses,
    students: state.students,
    enrollmentStatuses: state.enrollment_statuses
  }
};

function matchDispatchToProps(dispatch){
  return bindActionCreators({getLesson: LessonAction.getLesson,
  addLesson: LessonAction.addLesson,
  getSections: getSections, getInstructors: getInstructors,
  getLocations: getLocations},dispatch);
}



export default connect(mapStateToProps, matchDispatchToProps)(AddLesson);
