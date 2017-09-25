class LessonStatus < ActiveRecord::Base
  has_many :lesson_date_times
end
