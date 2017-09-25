class Location < ActiveRecord::Base
  belongs_to :farm
  has_many :lesson_date_times
end
