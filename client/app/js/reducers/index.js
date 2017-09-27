import { combineReducers } from 'redux';
import UserReducer from './reducer-users';
import userLoginDetail from './reducer-user-login-detail';
import Locations from './locations';
import LessonStatus from './lesson_status';
import Sections from './section';
import Instructor from './instructor';
import Student from './student';
import LessonDateTimes from './lesson_date_times';
import LessonDateTime from './lesson_date_time';
import GetLesson from './get_lesson';
import Horses from './horses';
import GetHorsesReport from './get_horses_report';
import EnrollmentStatuses from './enrollment_status';
import LessonPeople from './lesson_people';
import LessonHorses from './get_lesson_horses';
import UpdatedLesson from './update_lesson';
import AddLesson from './add_lesson';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

/*
 * We combine all reducers into a single object before updated data is dispatched (sent) to store
 * Your entire applications state (store) is just whatever gets returned from all your reducers
 * */

const allReducers = combineReducers({
  users: UserReducer,
  userLoginDetail: userLoginDetail,
  locations: Locations,
  lesson_status: LessonStatus,
  sections: Sections,
  instructors: Instructor,
  students: Student,
  lessonDateTimes: LessonDateTimes,
  lessonDateTime: GetLesson,
  horses: Horses,
  horsesReport: GetHorsesReport,
  enrollment_statuses: EnrollmentStatuses,
  lessonPeople: LessonPeople,
  lessonHorses: LessonHorses,
  updatedLesson: UpdatedLesson,
  addedNewLesson: AddLesson,
  routing: routerReducer
});

export default allReducers;
