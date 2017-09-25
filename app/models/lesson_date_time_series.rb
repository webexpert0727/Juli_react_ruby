class LessonDateTimeSeries < ActiveRecord::Base

  attr_accessor :name, :scheduled_starttime, :instructor_id, :location_id, 
                :section_id, :lesson_status_id, :lesson_notes, :farm_id,
                :scheduled_end_date, :scheduled_date,:scheduled_endtime,
                :is_recuring, :occurence, :lesson_people_attributes,
                :lesson_date_time_horses_attributes, :is_data_copied

  validates_presence_of :frequency, :period, :starttime, :endtime, :repeat_end_status
  
  belongs_to :user
  has_many :lesson_date_times, :dependent => :destroy

  after_create :create_lessons_until_end_time
  serialize :week_recuring_days, Array


  def create_lessons_until_end_time
    @first_record = true
    tmp_period = period
    week_days =  tmp_period == 'week' &&  !week_recuring_days.blank?
    st = starttime.to_datetime
    et = endtime.to_datetime 
    p = r_period(tmp_period)
    nst = st
    net = et
    date = st

    while st <= set_end_time(starttime.to_datetime, p)
      date_diff = scheduled_end_date.to_date - scheduled_date.to_date
      end_date = st + date_diff.to_i 
      if week_days
        create_lesson(nst, endtime, end_date, 'week')
      elsif week_days == false
        puts "h ------------------------#{st}"
        default_schedule_date = @first_record ? scheduled_date : nst
        default_end_date = @first_record ? scheduled_end_date : end_date
        recuring = @first_record ? is_recuring : false

        obj = self.lesson_date_times.create(name: name, scheduled_starttime: scheduled_starttime, scheduled_date: default_schedule_date,
              scheduled_endtime: scheduled_endtime,instructor_id: instructor_id, 
              location_id: location_id, section_id: section_id, lesson_status_id: lesson_status_id,
              lesson_notes: lesson_notes, farm_id: farm_id, scheduled_end_date: default_end_date,
              is_recuring: recuring, user_id: user_id)

        if is_data_copied.eql?('true') || @first_record
          create_horse_and_students(obj)
        end
      end
      # puts "rrrrr ------------------------#{st}"
      nst = st = frequency.to_i.send(p).from_now(st);
      net = et = frequency.to_i.send(p).from_now(et);
    end
  end
  
  def r_period(period)
    case period
      when 'day'
      lesson_period = 'days'
      when "week"
      lesson_period = 'weeks'
      when "monthly"
    end
    return lesson_period
  end

  def set_end_time(st, period_val)
    start_date = st
     case repeat_end_status
      when 'on'
        lesson_end_time = endtime
      when 'after'
        1.upto(occurence.to_i) do |i|
          st = frequency.to_i.send(period_val).from_now(st)
        end
      lesson_end_time = st
      when "never"
        lesson_end_time = Date.today+1.year
    end
    return lesson_end_time
  end

  def create_lesson(nst, endtime, end_date, type)
    if type == 'week'
      (nst.beginning_of_week..nst.end_of_week).each do |date|
        if (date.to_date >= starttime.to_date && date.to_date <= endtime.to_date) && week_recuring_days.include?(date.wday.to_s)

          default_schedule_date = @first_record ? scheduled_date : date
          default_end_date = @first_record ? scheduled_end_date : end_date
          recuring = @first_record ? is_recuring : false

          obj = self.lesson_date_times.create(name: name, scheduled_starttime: scheduled_starttime,
              scheduled_date: default_schedule_date, scheduled_endtime: scheduled_endtime,
              instructor_id: instructor_id, location_id: location_id, section_id: section_id, lesson_status_id: lesson_status_id,
              lesson_notes: lesson_notes, farm_id: farm_id, scheduled_end_date: default_end_date,
              is_recuring: recuring, user_id: user_id)

          if is_data_copied.eql?('true') || @first_record
            create_horse_and_students(obj)
          end
        end
      end
    end
  end

  def create_horse_and_students(obj)
    @first_record = false
    if lesson_people_attributes.present?
      lesson_people_attributes.each do |key, values|
        obj.lesson_people.create(values)
      end
    end
    if lesson_date_time_horses_attributes.present?
      lesson_date_time_horses_attributes.each do |key, values|
        obj.lesson_date_time_horses.create(values)
      end
    end
  end
end
