class LessonDateTime < ActiveRecord::Base
  belongs_to :lesson_status
  belongs_to :instructor
  belongs_to :section
  belongs_to :location
  belongs_to :firm
  belongs_to :user
  belongs_to :lesson_date_time_series
  
  has_many :lesson_people, dependent: :destroy
  has_many :lesson_date_time_horses , dependent: :destroy
  has_one :horse , through: :lesson_people, source: 'horse'
  accepts_nested_attributes_for :lesson_people
  accepts_nested_attributes_for :lesson_date_time_horses

  validates :name, :scheduled_date, :scheduled_starttime, 
            :instructor_id, :section_id, presence: true

  # validate :end_date_after_start_date?

  delegate :instructor_name, to: :instructor, allow_nil: true
  delegate :location_name, to: :location, allow_nil: true
  delegate :section_name, to: :section, allow_nil: true
  delegate :lesson_status_name, to: :lesson_status, allow_nil: true
  before_update :update_lesson_students_and_horses

  def as_json(options = {})
    json = super(options)
    json['instructor_name'] = instructor_name
    json['section_name'] = section_name
    json['location_name'] = location_name
    json['lesson_status_name'] = lesson_status_name
    json
  end

  def to_json(options = {})
    json = JSON.parse(super(options))
    json['lesson_people'] = get_lesson_people_data
    json['lesson_date_time_horses'] = lesson_date_time_horses_data
    json['series'] = lesson_date_time_series
    json
  end

  def get_lesson_people_data
    results = []
    lesson_people.includes(:horse,:student,:enrollment_status).each do |people|
    results.push({horse_id: people.horse_id, 
                  horse_name: people.horse_name, 
                  student_id: people.student_id,
                  student_name: people.student_name, 
                  enrollment_status_name: people.enrollment_status_name,
                  enrollment_status_id: people.enrollment_status_id,
                  id: people.id, 
                  paid: people.paid
                  })
    end
    results
  end

  def lesson_date_time_horses_data
    results = []
    lesson_date_time_horses.each do |horse|
    results.push({horse_id: horse.horse_id, 
                  horse_name: horse.horse_name,
                  id: horse.id})
    end
    results
  end

  # def end_date_after_start_date?
  #   if scheduled_end_date < scheduled_date
  #     errors.add :scheduled_end_date, "must be after start date"
  #   end
  # end

  def update_lesson_students_and_horses
    # lesson_date_time_horses.destroy_all
  end

  def update_lesson_date_times(lesson_date_times, lesson_date_time)
    lesson_date_times.each do |e|
      begin
        st, et = e.scheduled_date, e.scheduled_end_date
        e.attributes = lesson_date_time
        if lesson_date_time_series.period.downcase == 'monthly' or lesson_date_time_series.period.downcase == 'yearly'
          nst = DateTime.parse("#{e.scheduled_date.hour}:#{e.scheduled_date.min}:#{e.scheduled_date.sec}, #{e.scheduled_date.day}-#{st.month}-#{st.year}")
          net = DateTime.parse("#{e.scheduled_end_date.hour}:#{e.scheduled_end_date.min}:#{e.scheduled_end_date.sec}, #{e.scheduled_end_date.day}-#{et.month}-#{et.year}")
        else
          nst = DateTime.parse("#{e.scheduled_date.hour}:#{e.scheduled_date.min}:#{e.scheduled_date.sec}, #{st.day}-#{st.month}-#{st.year}")
          net = DateTime.parse("#{e.scheduled_end_date.hour}:#{e.scheduled_end_date.min}:#{e.scheduled_end_date.sec}, #{et.day}-#{et.month}-#{et.year}")
        end
        #puts "#{nst}           :::::::::          #{net}"
      rescue
        nst = net = nil
      end
      if nst and net
        #          e.attributes = event
        e.scheduled_date = nst
        e.scheduled_end_date = net
        e.save
      end
    end
    lesson_date_time_series.attributes = lesson_date_time
    lesson_date_time_series.save
  end

end
