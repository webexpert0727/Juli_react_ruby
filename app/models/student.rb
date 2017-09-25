class Student < ActiveRecord::Base
  has_many :lesson_people
  has_many :lesson_date_times, :through => :lesson_people
end
