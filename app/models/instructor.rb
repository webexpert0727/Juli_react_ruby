class Instructor < ActiveRecord::Base
  has_many :lesson_date_times
end
