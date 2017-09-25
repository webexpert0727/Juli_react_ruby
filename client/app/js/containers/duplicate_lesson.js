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

class DuplicateLesson extends BaseComponent {
    
  constructor(props, context){
    super(props, context);
    this.state={horses: {},students: {},startTime: moment(new Date()), 
      endTime: moment(new Date()), 
      scheduledStartDate:  moment(new Date()),
      scheduledEndDate:  moment(new Date())}

    this._bind('addHorse','addStudent','selectAllHorses','selectAllStudents',
     'createHorseList','createStudentList','endTimeChange','addScheduledEndDate',
     'addScheduledStartDate','startTimeChange','doSubmit');
  }

  componentDidMount(){
    var students = this.groupByKeys(this.props.lesson.lesson_people);
    var horses =  this.groupByKeys(this.props.lesson.lesson_date_time_horses);
    this.setState({students: students, horses: horses})
  }

  doSubmit(formData){
    var lesson = this.props.lesson;
    var data = {lesson_date_time: {
      name: lesson.name,
      section_id: lesson.section_id,
      lesson_status_id: lesson.lesson_status_id,
      instructor_id: lesson.instructor_id,
      scheduled_starttime: this.state.startTime.toLocaleString(),
      scheduled_endtime: this.state.endTime.toLocaleString(),
      scheduled_end_date: this.state.scheduledEndDate.toLocaleString(),
      scheduled_date: this.state.scheduledStartDate.toLocaleString(),
      location_id: lesson.location_id,
      is_recuring: false,
      lesson_notes: lesson.lesson_notes
    }};

    var studentData = [];
    var horseData = [];

    _.each(this.state.students, function(value,key){
      studentData.push({horse_id: value.horse_id, paid: value.paid,
        enrollment_status_id: value.enrollment_status_id,
        student_id: value.student_id
      });
    });

    _.each(this.state.horses, function(value,key){
      horseData.push({horse_id: value.horse_id})
    });

    data['lesson_date_time']['lesson_date_time_horses_attributes'] = horseData;
    data['lesson_date_time']['lesson_people_attributes'] = studentData;
    this.props.addLesson(data);
  };

  groupByKeys(data){
    var results = {};
    _.each(data, function(val){
        results[val.id] = val;
    });
    return results;
  };

  addHorse(e, horse){
    var horses = this.state.horses;
    var checked = e.target.checked;
    if(checked){
      horses[horse.id] = horse
    }else{
      delete horses[horse.id];
    }
    this.setState({horses: horses});
  };

  addStudent(e, student){
    var students = this.state.students;
    var checked = e.target.checked;
    if(checked){
      students[student.id] = student
    }else{
      delete students[student.id];
    }
    this.setState({students: students});
  };

  selectAllHorses(e, type){
    var horse_ids = this.groupByKeys(this.props.lesson.lesson_date_time_horses);
    var horses = this.state.horses;
    if(type == 'select'){
      horse_ids = this.groupByKeys(this.props.lesson.lesson_date_time_horses);
    }else{
      horse_ids = [];
    }
    this.setState({horses: horse_ids});
  };

  selectAllStudents(e, type){
    var student_ids = this.groupByKeys(this.props.lesson.lesson_people);
    var students = this.state.students;
    if(type == 'select'){
      student_ids = this.groupByKeys(this.props.lesson.lesson_people)
    }else{
      student_ids = [];
    }
    this.setState({students: student_ids});
  };

  endTimeChange(time){
    if(time){
      this.setState({endTime: moment(time._d)});
    }    
  };

  startTimeChange(time){
    if(time){
      this.setState({startTime: moment(time._d)});
    }  
  };

  addScheduledEndDate(date){
    this.setState({scheduledEndDate: date});
  };

  addScheduledStartDate(date){
    this.setState({scheduledStartDate: date, endMinDate: date, scheduledEndDate: date});
  };

  createHorseList(horse){
    var checked = _.find(this.state.horses, function (value, key) {
      return value.id == horse.id
    })
    return <div key={horse.id} className="cbSngl"><label><p>{horse.horse_name}</p><input type="checkbox" checked={checked} onChange={(e)=>{this.addHorse(e, horse)}} /><span></span></label></div>
  };

  createStudentList(student){
    var checked = _.find(this.state.students, function (value, key) { return value.id == student.id})
    return <div className="cbSngl" key={student.id}><label><p>{student.student_name}</p><input type="checkbox" checked={checked} onChange={(e)=>{this.addStudent(e, student)}} /><span></span> </label></div>
  };

  render() {
    var lesson = this.props.lesson || {}
    var horses = _.map(lesson.lesson_date_time_horses, this.createHorseList);
    var students = _.map(lesson.lesson_people, this.createStudentList);
    return (
      <div className="addLsnPop dplcatLsn">
        <AtomicForm ref="editLessonForm" initialData={this.state.initialData} 
          doSubmit={this.doSubmit} afterValidation={this.afterValidation}>
          <div className="alpInr">
            <div className="popHead">
              <h2>Duplicate lesson</h2>
            </div>
            <div className="closePop" onClick={()=>{this.props.closeModal()}}><span></span></div>
            <div className="popBody">
              <h2>You're about to duplicate <strong>{lesson.name}</strong></h2>
              <h3>Include:</h3>
              <div className="slct_cnt duplLsn">
                <label>Attendeess</label>
                <div className="slctSnglall">
                  <a href="javascript:void(0)" onClick={(e) =>{this.selectAllStudents(e,'select')}}>Select all</a>
                  <a href="javascript:void(0)" onClick={(e) =>{this.selectAllStudents(e,'deselect')}}>Select none</a>
                </div>
                <div className="chkbxCnt">
                  {students}
                </div>
              </div>
              <div className="slct_cnt duplLsn">
                <label>Horses</label>
                <div className="slctSnglall">
                  <a href="javascript:void(0)" onClick={(e) =>{this.selectAllHorses(e,'select')}}>Select all</a>
                  <a href="javascript:void(0)" onClick={(e) =>{this.selectAllHorses(e,'deselect')}}>Select none</a>
                </div>
                <div className="chkbxCnt">
                  {horses}
                </div>
              </div>
              <p><em>Not sure who to add? You can always duplicate the lesson now and add or remove attendees or horses at a later time.</em></p>
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
                <label>Ends Date</label>
                <div className="snglFld">
                  <DatePicker
                   selected={this.state.scheduledEndDate}
                   onChange={this.addScheduledEndDate}
                   dateFormat="MMMM DD , YYYY"
                   minDate={this.state.endMinDate}
                   readOnly={true}
                   />
                </div>
                <div className="snglFld">
                  <TimePicker 
                    format="hh:mm A"
                    showSecond={false}
                    onChange={this.endTimeChange}
                    defaultValue={this.state.endTime}
                    use12Hours={true}
                    className="endtimepicker"
                    popupClassName="endtimepickerpopup"
                    allowEmpty={false}
                    />
                </div>
              </div>
              <div className="btmBtns">
                <div className="bbsnglBtn orangeBtn">
                  <button type="submit">Duplicate lesson</button>
                </div>
                <div className="bbsnglBtn defaultBtn">
                  <a href="javascript:void(0)" onClick={()=>{this.props.closeModal()}}>Cancel</a>
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
    lessonDateTime: state.lessonDateTime
  }
};

function matchDispatchToProps(dispatch){
  return bindActionCreators({getLesson: LessonAction.getLesson,
  addLesson: LessonAction.addLesson,
  getSections: getSections, getInstructors: getInstructors,
  getLocations: getLocations},dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(DuplicateLesson);
