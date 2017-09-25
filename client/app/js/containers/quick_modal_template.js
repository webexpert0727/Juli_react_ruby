import React, {Component}           from 'react';
import {connect}                    from 'react-redux';
import  LessonAction                from '../actions/lesson';
import { bindActionCreators }       from 'redux';
import BaseComponent                from '../components/base_component';
import moment                       from 'moment';
import Settings                     from '../settings';

class QuickModalTemplate extends BaseComponent {
    
  constructor(props, context){
    super(props, context);
    this.state = {userRole: Settings.userRole(), user: Settings.currentUser()}
    this._bind('createStudentList')
  }

  createStudentList(people){
    return <div className="snglClDtl dblBlck clearfix" key={people.id}>
      <div className="scdLeft">
         <div className="clntNmeImg">
            <div className="clientImg red_clnt"></div>
            <div className="clntName">{people.student_name}</div>
         </div>
         <div className="ntPaidCncl clearfix">
            <ul>
               <li>
                  <div className="paid">{people.paid == 1 ? 'Paid' : 'Not paid'}</div>
               </li>
               <li>
                  <div className="cncled">
                     {people.enrollment_status_name}
                  </div>
               </li>
            </ul>
         </div>
      </div>
      <div className="scdRight">
         <div className="hrsImg green_clnt"></div>
         <span>assigned to</span>
         <div className="asgnyName">{people.horse_name}</div>
      </div>
    </div>
  }


  render() {
      var lessonDetail = this.props.lessonDateTime;
      var scheduledDate = lessonDetail && moment(lessonDetail.scheduled_date).utc().format('dddd, MMMM DD, YYYY');
      var scheduledStartTime =  lessonDetail && moment(lessonDetail.scheduled_starttime).utc().format('hh:mm A');
      var scheduledEndTime =  lessonDetail && moment(lessonDetail.scheduled_endtime).utc().format('hh:mm A');
      var studentLessonDetails = _.map(lessonDetail && lessonDetail.lesson_people, this.createStudentList)
      return (
        <div>
          { lessonDetail &&
           <div className="blgCnt">
              <div className="blgCntInr">
                 <button id="closepopover" type="button" className="close" aria-hidden="true" onClick={this.props.hideModal}><span>&times;</span></button>
                 <div className="topOrngStrip"></div>
                 <div className="bglHead">
                    <h1>{lessonDetail.name} </h1>
                    <h4>Section {this.props.lessonDateTime.section_id}</h4>
                    <div className="grpType">
                       <div className="actDect activeGrp">
                        <span></span>
                        <p>{lessonDetail.lesson_status_name}</p>
                       </div>
                    </div>
                 </div>
                 <div className="topClDtl">
                    <div className="snglClDtl">
                       <div className="clntNmeImg">
                          <div className="clientImg red_clnt"></div>
                          <div className="clntName">{lessonDetail.instructor_name}</div>
                       </div>
                       <p>{lessonDetail.location_name}</p>
                    </div>
                 </div>
                 <div className="snglBlck">
                    <div className="blckHead">Date and time</div>
                    <div className="datetTime">
                       <span>{scheduledDate}</span>
                       <span>{scheduledStartTime} to {scheduledEndTime}</span>
                    </div>
                    {lessonDetail.series && lessonDetail.series.period &&
                      <div className="reocrs">
                        <div className="rcorsIcn"></div>
                        <p>This Lesson reocurres every {lessonDetail.series && lessonDetail.series.frequency > 1 ? lessonDetail.series.frequency + ' ' : ''}
                         {lessonDetail.series.period}</p>
                      </div>
                    }
                 </div>
                 <div className="snglBlck">
                    <div className="blckHead">Lesson attendees</div>
                    <div className="clntDtls">
                      {studentLessonDetails}
                    </div>
                 </div>
                 <div className="snglBlck notes">
                    <div className="blckHead">Notes (Visible to clients and staff)</div>
                    <p style={{cursor: 'pointer'}}onClick={(e) =>{this.handleClick.bind(this)}}>{lessonDetail.lesson_notes}.</p>
                 </div>
                 <div className="btmBtns">
                    <div className="bbsnglBtn orangeBtn">
                    {(this.state.userRole == 'administrator' || (this.state.userRole == 'instructor' && this.state.user && this.state.user.id == this.props.lessonOwnerId)) &&
                      <a href="javascript:void(0)" onClick={this.props.editLesson}>Edit lesson</a>
                    }
                    </div>
                 </div>
              </div>
           </div>
          }
        </div>
      );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    lessonDateTime: state.lessonDateTime,
  }
};

function matchDispatchToProps(dispatch){
    return bindActionCreators({getLesson: LessonAction.getLesson},dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(QuickModalTemplate);
