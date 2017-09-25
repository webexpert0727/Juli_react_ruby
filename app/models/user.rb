class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  enum user_type: [:instructor, :student, :administrator]

  has_one :student
  has_one :instructor

  has_many :lesson_date_times
  has_many :lesson_date_time_series
  has_many :instructor_lessons, :through => :instructor, :source => "lesson_date_times"
  has_many :student_lessons, :through => :student, :source => 'lesson_date_times' 
  has_one :horse , through: :lesson_people, source: 'horse'

  validates :user_type, presence: true
  validates :password_confirmation, presence: true, on: :create

  after_create :create_instructor_or_student

  def create_instructor_or_student
    if instructor?
      Instructor.create(user_id: id, instructor_name: username)
    else
      Student.create(user_id: id, student_name: username)
    end
  end

  def get_lessons
    if instructor?
      (instructor_lessons.includes(:lesson_people, :instructor, :section, :location, :lesson_status) +
      lesson_date_times.includes(:lesson_people, :instructor, :section, :location, :lesson_status)).uniq
    elsif student?
      student.lesson_date_times.includes(:lesson_people, :instructor, :section, :location, :lesson_status)
    else
      LessonDateTime.includes(:lesson_people, :instructor, :section, :location, :lesson_status)
    end
  end
end
