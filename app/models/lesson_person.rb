class LessonPerson < ActiveRecord::Base
  belongs_to :horse
  belongs_to :student
  belongs_to :enrollment_status
  belongs_to :lesson_date_time

  delegate :horse_name, to: :horse, allow_nil: true
  delegate :student_name, to: :student, allow_nil: true
  delegate :enrollment_status_name, to: :enrollment_status, allow_nil: true

end
