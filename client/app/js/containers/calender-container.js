import React, {Component}           from 'react';
import {connect}                    from 'react-redux';
import { login }                    from '../actions/user';
import { getLocations }             from '../actions/location';
import { getLessonStatus }          from '../actions/lesson_status';
import { getSections }              from '../actions/section';
import { getInstructors }           from '../actions/instructor';
import { getStudents }              from '../actions/student';
import  LessonAction                from '../actions/lesson';
import AtomicForm                   from "atomic-form";
import { bindActionCreators }       from 'redux';
import {browserHistory}             from 'react-router';
import Settings                     from '../settings';
import Modal                        from "simple-react-modal";
import BaseComponent                from '../components/base_component';
import _                            from "lodash";
import Api                          from   "../actions/api";
import moment                       from 'moment';
import ReactSelect                  from 'react-select';
import QuickModalTemplate           from './quick_modal_template';
import EditModalTemplate            from './edit_modal_template';
import AddLesson                    from './add_lesson';
import DuplicateLesson              from './duplicate_lesson';
                                  
class CalenderContainer extends BaseComponent {
    
  constructor(props, context){
    super(props, context);
    this.state = { locationId: {}, initialData: {}, openModel: false, 
      lessonStudents: {}, studentHourses: {}, enrollments: {},
      lessonStudentArray: {}, includedStudents: [], 
      quickViewModel: false, hideQuickModal: false,
      editModelPopup: false, userRole: Settings.userRole() 
    }

    this._bind('addLesson','closeModal','createLocationList',
      'createLessonStatusList','onRecuringChanged','selectStudent',
      'removeStudent','createStudentLessonList','changeEnStatus','changeHourse',
      'changePaidStatus','afterValidation','getSelectedHourseId',
      'updateStudentAssingStatus','discardChanges','showEditModel','hideModal',
      'editLesson','hideLessonPopup','setCalenderEvents','checkNewLessonAdded',
      'initCalenderLessons','allLessons','updateDetetedLesson','duplicateLesson',
      'setCalenderDate')
  }

  componentWillMount() {
    this.props.getSections();
    this.props.getInstructors();
    this.props.getLocations();
    this.props.getHorses();
    this.props.getStudents();
    this.props.getEnrollmentStatuses();
  }
  
  componentWillReceiveProps(nextProps){
    var lessonDateTime = nextProps.lessonDateTime;
    var peoples = [];
    var lessonStudentArray = {};
    if(nextProps.lessonPeople){
      _.each(nextProps.lessonPeople, function(people){
        peoples.push(people.student_id);
        lessonStudentArray[people.student_id] = {
          enrollment_status_id: people.enrollment_status_id,
          horse_id: people.horse_id,
          student_id: people.student_id,
          paid: people.paid
        }
      })
    }
    this.selectStudent(peoples);
    this.setState({lessonDateTimes: nextProps.lessonDateTimes,initialData: 
      lessonDateTime, locationId: lessonDateTime && lessonDateTime.location_id,
      includedStudents: peoples, lessonStudentArray: lessonStudentArray,
      lessonPeopleStates: nextProps.lessonPeople
    });

    if(nextProps.updatedLesson && nextProps.updatedLesson.lesson_date_time){
      this.setState({editModelPopup: false});
      var events = this.state.events;
      var dates = this.setEventDates(nextProps.updatedLesson.lesson_date_time);
      var updatedEvents = _.map(events, function (value, key) {
          if(value.id == nextProps.updatedLesson.lesson_date_time.id){ 
            value.title = dates.title
            value.start = dates.startDate
            value.end = dates.endDate
            return value;
          }else{
            return value;
          }
      });
      $('#calendar').fullCalendar( 'removeEvents');
      $('#calendar').fullCalendar( 'addEventSource', updatedEvents); 
      $('#calendar').fullCalendar( 'rerenderEvents' );
      this.props.updateLessonData('UPDATE_LESSON');
    };

    if(nextProps.addedNewLesson && nextProps.addedNewLesson.added_lesson_date_times){
      var events = this.allLessons(nextProps.addedNewLesson.added_lesson_date_times);
      this.updateCalenderLesson(events);
      this.setState({openModel: false, duplicate: false});
      this.props.updateLessonData('ADD_LESSON');
    }
  };

  updateCalenderLesson(events){
    $('#calendar').fullCalendar( 'removeEvents');
    $('#calendar').fullCalendar( 'addEventSource', events); 
    $('#calendar').fullCalendar( 'rerenderEvents' );
  }

  updateDetetedLesson(lessons){
    var events = this.allLessons(lessons);
    this.updateCalenderLesson(events);
    this.setState({editModelPopup: false});
  };

  checkNewLessonAdded(nextProps){
    var lesson = nextProps.addedNewLesson;
    this.setState({openModel: false});
    var events = this.state.events;
    var dates = this.setEventDates(lesson.lesson_date_time);
    events.push({
      id: lesson.lesson_date_time.id,
      title: dates.title,
      start: dates.startDate,
      end: dates.endDate,
      lessonOwnerId: lesson.lesson_date_time.user_id
    })
    $('#calendar').fullCalendar( 'removeEvents');
    $('#calendar').fullCalendar( 'addEventSource', events); 
    $('#calendar').fullCalendar( 'rerenderEvents' );
    this.props.updateLessonData('ADD_LESSON');
  };

  componentDidMount() {
    var that = this;
    Api.get('/lesson_date_times').then(function(res,err){
      that.initCalenderLessons(res.lesson_date_times);
    });
  };

  initCalenderLessons(res){
    var events = this.allLessons(res);
    console.log('xxxxxxxxxxxxxxx',events)
    this.setState({events: events, editModelPopup: false});
    this.setCalenderEvents(events);
  };

  duplicateLesson(){
    this.hideModal();
    this.setState({duplicate: true});
  };

  allLessons(res){
    var colorCodes = ['#007F00', '#33CEFF'];
    var that = this;
    var color;
    var events = [];
    _.each(res, function(lesson){
      if(lesson.scheduled_date){
        var dates = that.setEventDates(lesson);
        if(new Date(dates.startDate) > new Date()){
          color = colorCodes[Math.floor(Math.random() * colorCodes.length)];
        }else{
          color = '#FF6347'
        }
        events.push({
          id: lesson.id,
          title: dates.title,
          start: dates.startDate,
          end: dates.endDate,
          color: color,
          lessonOwnerId: lesson.user_id
        });
      }
    });
    return events;
  };

  setEventDates(lesson){
   var d = new Date(lesson.scheduled_date)
    var date = d.getDate();
    var month = d.getMonth()+1;
    var year = d.getFullYear();
    if(month < 10){month = "0"+month}
    if(date < 10){date = "0"+date}
    var title = " ";
    if(lesson.name){
      title+= lesson.name+ " "
    }
    if(lesson.instructor_name){
      title+= lesson.instructor_name + " "
    }
    if(lesson.location_name){
      title+= lesson.location_name
    }

    var starttime = moment(lesson.scheduled_starttime).utc().format('HH:mm')
    var endtime = moment(lesson.scheduled_endtime).utc().format('HH:mm')
    var startDate = year + '-' + month + '-' + date +' '+ starttime;
    var endDate = year + '-' + month + '-' + date +' '+ endtime;
    return {title: title, startDate: startDate, endDate: endDate};
  };

  setCalenderDate(){
    var that = this;
    $('.fc-scroller>.fc-day-grid, .fc-scroller>.fc-time-grid').css({'width':'50%'});
    $('.fc-scroller>.fc-day-grid, .fc-scroller>.fc-time-grid').parent().find('.day-calender').remove();
    $('.fc-scroller>.fc-day-grid, .fc-scroller>.fc-time-grid').parent().prepend('<div class="day-calender"><div>')
    $('.day-calender').datepicker({
      inline: true,
      onSelect: function(dateText, inst) {
        var d = new Date(dateText);
        $('#calendar').fullCalendar('gotoDate', d);
        that.setCalenderDate();
      }
    });
  }

  setCalenderEvents(events){
    var that = this;
    var calendar = $('#calendar').fullCalendar({
      header:{
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      defaultView: 'agendaWeek',
      selectable: true,
      selectHelper: true,
      allDaySlot: false,
      eventClick: function(calEvent, jsEvent, view) {
        that.setState({ 
          quickViewModel: true,
          editModelPopup: false,
          lessonOwnerId: calEvent.lessonOwnerId
        });
        that.props.getLesson(calEvent.id);
      },

      select: function(start, end, allDay){
        if(that.state.userRole != 'student'){
          that.setState({openModel: true, startTime: start, endTime: end,
          scheduledStartDate: start, scheduledEndDate: end, calenderClicked: true});
        }
      },
      timeFormat: 'hh:mm A',
      // timeFormat: 'hh:mm A - hh:mm A ',
      editable: true,
      // events: events,
      eventLimit: 4,
      events: events,

    }).on('click', '.fc-agendaWeek-button', function() {
      var currentDate = new Date();
      $('#calendar').fullCalendar('gotoDate', currentDate);
    }).on('click', '.fc-month-button', function() {
      var currentDate = new Date();
      $('#calendar').fullCalendar('gotoDate', currentDate);
    }).on('click', '.fc-agendaDay-button', function() {
        that.setCalenderDate();
    }).on('click', '.fc-prev-button, .fc-next-button', function(e,a,b) {
      if($('.fc-agendaDay-button').hasClass('fc-state-active')){
        that.setCalenderDate();
      }
    });
  };

  showEditModel(){
    this.setState({showEditModel: true, hideQuickModal: false});
  };

  afterValidation(formValidations) {
    //Callback after validation fails. 
    this.setState({validations: formValidations});
  };

  onInputChange() {
    //Optional - If we want to validate the form from an onChange callback. 
    var formData = this.refs.MainForm.formData();
    var formValidations = this.refs.MainForm.validateForm(formData);
    this.setState(validations: formValidations);
  };

  closeModal() {
    this.setState({openModel: false, quickViewModel: false,
    editModelPopup: false, duplicate: false});
  };
 
  validationMessage(field) {
    if (this.state.validations && this.state.validations[field]) {
      if (!this.state.validations[field].isValid) {
        return _.map(this.state.validations[field].message, (message,idx) => {
          return <span key={idx} style={{color: 'red'}}>{message}</span>;
        });
      }
    }
    return <div/>;
  };

  addLesson(e){
    var position = $(e.target).offset();
    var isNewLesson = !this.state.isNewLesson
    this.setState({openModel: true, initialData: {}, lessonPeopleStates: [],
      includedStudents: [], lessonStudents: {}, 
      lessonStudentArray: {}, isNewLesson: isNewLesson, addPopupTop: position.top,
      addPopupLeft: position.left - 580, hideQuickModal: false,
      editModelPopup: false, calenderClicked: false
    });
  };

  changeLocation(e){
    this.setState({locationId: e.currentTarget.value });
  };

  createLocationList(location){
    return <span key={location.id}> {location.location_name}<input type="radio" 
      value={location.id} onChange={(e) => {this.changeLocation(e) }} 
      name="location" checked={this.state.locationId == location.id}/><br/> 
    </span>
  };

  createLessonStatusList(status){
    return <option value={status.id} key={status.id}>{status.lesson_status_name}</option>
  };

  createSectionsList(section){
    return <option value={section.id} key={section.id}>{section.section_name}</option> 
  };

  createInstructorList(instructor){
    return <option value={instructor.id} key={instructor.id}>{instructor.instructor_name}</option>  
  };

  createStudentList(student){
    return {value: student.id, label: student.student_name} 
  };

  createHorsesList(horse){
    return <option value={horse.id} key={horse.id}>{horse.horse_name}</option>    
  };

  createenrollmentStatusesList(status){
    return <option value={status.id} key={status.id}>{status.enrollment_status_name}</option>    
  };

  onRecuringChanged(e){
    this.setState({isRecuring: e.target.checked });
  };

  selectStudent(options){
    var lessonStudents = {};
    var that = this;
    _.each(options, function (option, key1) {
      _.find(that.props.students, function (value, key) {
          if(value.id == option && !lessonStudents[value.id]){ 
            lessonStudents[value.id] = value
          }
      });
    });
    lessonStudents = options.length > 0 ? lessonStudents : {};
    this.setState({lessonStudents: lessonStudents, includedStudents: options || [] });
  }

  changeEnStatus(e, student){
    var data = this.state.lessonStudentArray;
    var horse_id = data[student] && data[student]['horse_id'] ? data[student]['horse_id'] : {};
    var paid = data[student] && data[student]['paid'] ? data[student]['paid'] : false;
    data[student] = {enrollment_status_id: e.target.value, horse_id: horse_id, paid: paid};
    var lessonArray = this.updateStudentAssingStatus(student, 'enrollment_status_id', e.target.value);
    this.setState({lessonStudentArray: data, lessonPeopleStates: lessonArray});
  };

  changeHourse(e, student){
    var data = this.state.lessonStudentArray;
    var enrollment_status_id = data[student] && data[student]['enrollment_status_id'] ? data[student]['enrollment_status_id'] : {};
    var paid = data[student] && data[student]['paid'] ? data[student]['paid'] : false;
    data[student] = {horse_id: e.target.value, enrollment_status_id: enrollment_status_id, paid: paid}
    var lessonArray = this.updateStudentAssingStatus(student, 'horse_id', e.target.value);
    this.setState({lessonStudentArray: data, lessonPeopleStates: lessonArray});
  };

  changePaidStatus(e, student){
    var data = this.state.lessonStudentArray;
    var isChecked = e.target.checked ? 1 : 0;
    var enrollment_status_id = data[student] && data[student]['enrollment_status_id'] ? data[student]['enrollment_status_id'] : {};
    var horse_id = data[student] && data[student]['horse_id'] ? data[student]['horse_id'] : {};

    data[student] = {horse_id: horse_id, enrollment_status_id: enrollment_status_id, paid: isChecked}
    var lessonPeopleStates = this.state.lessonPeopleStates;
    var lessonArray = this.updateStudentAssingStatus(student, 'paid', isChecked);
    this.setState({lessonStudentArray: data, lessonPeopleStates: lessonArray});
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

  getSelectedHourseId(student, field){
    var selectedField = "";
    _.each(this.state.lessonPeopleStates, function(people){
      if(student.id == people.student_id){
        selectedField = people[field];
      }
    })
    return selectedField;
  };

  createStudentLessonList(student){
    var selectedHourse = this.getSelectedHourseId(student,'horse_id');
    var selectedEnrollStatus = this.getSelectedHourseId(student,'enrollment_status_id');
    var paidStatus = this.getSelectedHourseId(student,'paid');
    var horses = _.map(this.props.horses, this.createHorsesList);
    var enrollmentStatuses = _.map(this.props.enrollmentStatuses, this.createenrollmentStatusesList);
    paidStatus = paidStatus == 0 ? false : true;
    
    return <div className="panel panel-default" key={student.id}>
        <div className="panel-heading">
          <h3 className="panel-title">{student.student_name} <span 
          className="pull-right" style={{cursor: 'pointer'}} 
          onClick={(e) =>{this.removeStudent(e,student.id)}}>X</span></h3>
        </div>
        <div className="panel-body">
          <div className="row">
            <div className="col-md-2">
              Paid  <br/> <input type="checkbox" onChange={(e) => 
                {this.changePaidStatus(e, student.id)}} defaultChecked={paidStatus}/>
            </div>
            <div className="col-md-5">
              Status <br/> 
              <select className="form-control"  defaultValue={selectedEnrollStatus}
                 onChange={(e) => {this.changeEnStatus(e,student.id)}}>
                <option>Select Status</option>
                {enrollmentStatuses}
              </select>
            </div>
            <div className="col-md-5">
              Assign To <br/> 
              <select className="form-control" defaultValue={selectedHourse}
               onChange={(e) => {this.changeHourse(e,student.id)}} >
                <option>Select Hourse</option>
                {horses}
              </select>
            </div>
          </div>
        </div>
      </div>
  }

  removeStudent(e,student){
    var studentData = this.state.lessonStudents;
    var lessonStudentArray = this.state.lessonStudentArray;
    delete studentData[student];
    delete lessonStudentArray[student];
    var includedStudents = this.state.includedStudents;
    includedStudents = JSON.parse("[" + includedStudents + "]")
    var index = includedStudents.indexOf(student);
    if(index > -1){
      includedStudents.splice(index,1);
    }
    this.setState({lessonStudents: studentData, lessonStudentArray: lessonStudentArray,
      includedStudents: includedStudents.toString()});
  };

  discardChanges(){
    if(!this.state.isNewLesson && this.props.lessonDateTime && this.props.lessonDateTime.id){
      this.props.getLesson(this.props.lessonDateTime.id);
    }
  };

  editLesson(){
    this.setState({quickViewModel: false, editModelPopup: true});
  };

  hideModal(){
    this.setState({quickViewModel: false, editModelPopup: false});
  };

  hideLessonPopup(){
    this.setState({isNewLesson: false});
  };

  render() {
    var locations = _.map(this.props.locations, this.createLocationList);
    var lessonStatus = _.map(this.props.lesson_status, this.createLessonStatusList);
    var sections = _.map(this.props.sections, this.createSectionsList);
    var instructors = _.map(this.props.instructors, this.createInstructorList);
    var students = _.map(this.props.students, this.createStudentList);
    var lessonStudentList = _.map(this.state.lessonStudents, this.createStudentLessonList);

    return (
      <div className="rightMain">
        <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">
          <div className="rghtHeadTop clearfix">
          <h1>Cold Brook stable calendar {this.state.isNewLesson == true}</h1>
          <div className="rhtSrch">
            <form>
              <input type="text" placeholder="Search Calendar" className="test"/>
                <button type="submit"></button>
              </form>
          </div>
          </div>
            <div className="rghtCalCntnr">
              <div className="rccInr">
                <div className="addLsn">
                  {this.state.userRole != 'student' &&
                    <a href="javascript:void(0)" onClick={(e)=>{ this.addLesson(e) }}>Add a lesson</a>
                  }
                  </div>
                  <div id="calendar"></div>
                </div>
            </div>
          </div>
          <footer>
            <div className="footTop"><span><img src="assets/footerIcn.png" alt="Footer Icon" /></span></div>
            <div className="footBtm"></div>
          </footer>
          <Modal id="test-class"  show={this.state.quickViewModel} onClose={(e)=> { this.closeModal()}} containerStyle={{width: 740}}>
            <QuickModalTemplate btnTapped={this.btnTapped}
              modalTop={this.state.modalTop}
              modalLeft={this.state.modalLeft}
              hideModal={this.hideModal}
              editLesson={this.editLesson}
              lessonOwnerId={this.state.lessonOwnerId}
            />
          </Modal>

          <Modal id="edit-lesson" show={this.state.editModelPopup} onClose={(e)=> { this.closeModal()}} containerStyle={{width: '70%'}}>
            <EditModalTemplate
            editModelPopup={this.state.editModelPopup}
            modalTop={this.state.modalTop}
            modalLeft={this.state.modalLeft}
            hideModal={this.hideModal}
            discardChanges={this.discardChanges}
            updateDetetedLesson={this.updateDetetedLesson}
            duplicateLesson={this.duplicateLesson}
            updateDetetedLesson={this.updateDetetedLesson}
            />
          </Modal>

          <Modal id="add-new-lesson" show={this.state.openModel} onClose={(e)=> { this.closeModal()}} containerStyle={{width: 600}}>
            <AddLesson
            addPopupTop={this.state.addPopupTop}
            addPopupLeft={this.state.addPopupLeft}
            closeModal={this.closeModal}
            startTime= {this.state.startTime}
            endTime= {this.state.endTime}
            scheduledStartDate= {this.state.scheduledStartDate}
            scheduledEndDate= {this.state.scheduledEndDate}
            calenderClicked= {this.state.calenderClicked}
            />
         </Modal>

          <Modal id="add-new-lesson" show={this.state.duplicate} onClose={(e)=> { this.closeModal()}} containerStyle={{width: 600}}>
            <DuplicateLesson 
            closeModal={this.closeModal}
            lesson={this.props.lessonDateTime}
            />
          </Modal>
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    locations: state.locations,
    lesson_status: state.lesson_status,
    sections: state.sections,
    instructors: state.instructors,
    students: state.students,
    lessonDateTimes: state.lessonDateTimes,
    lessonDateTime: state.lessonDateTime,
    horses: state.horses,
    enrollmentStatuses: state.enrollment_statuses,
    lessonPeople: state.lessonPeople,
    updatedLesson: state.updatedLesson,
    addedNewLesson: state.addedNewLesson
  }
};

function matchDispatchToProps(dispatch){
    return bindActionCreators({login: login, getLocations: getLocations,
    getLessonStatus: getLessonStatus,getSections: getSections, 
    getInstructors: getInstructors, getStudents: getStudents,
    addLesson: LessonAction.addLesson,getLessons :LessonAction.getLessons,
    getLesson: LessonAction.getLesson, getStudent: LessonAction.getStudent,
    getHorses: LessonAction.getHorses, 
    getEnrollmentStatuses: LessonAction.getEnrollmentStatuses,
    getLessonPeople:  LessonAction.getLessonPeople,
    getLessonHorses: LessonAction.getLessonHorses,
    updateLessonData: LessonAction.updateLessonData},dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(CalenderContainer);
