class LessonDateTimeHorse < ActiveRecord::Base
  belongs_to :horse
  belongs_to :lesson_date_time

  delegate :horse_name, to: :horse, allow_nil: true
end
