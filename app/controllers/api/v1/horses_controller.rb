class Api::V1::HorsesController < Api::V1::ApiController

  def index
    horses = Horse.all

    render status: 200, json: { horses: horses }
  end

  def horses_report
    horses_report = LessonDateTimeHorse.select(
      "lesson_date_time_horses.horse_id as horse_id,lesson_date_times.name as lesson_name,instructor_name as instructor_name, lesson_date_times.lesson_notes,DATE_FORMAT(lesson_date_times.scheduled_date,'%a, %b %d,%Y') as scheduled_date,DATE_FORMAT(lesson_date_times.scheduled_starttime,'%I %i %p') as start_time,DATE_FORMAT(lesson_date_times.scheduled_endtime,'%I %i %p') as end_time, DAYNAME(lesson_date_times.scheduled_date) as day,count(*) as count, horses.horse_name as horse_name"
    ).joins(
      :horse, :lesson_date_time => :instructor
    ).group(
      "DAYNAME(lesson_date_times.scheduled_date), lesson_date_time_horses.horse_id")
    .order(
      "lesson_date_times.scheduled_date"
    )


    filter_data = LessonDateTimeHorse.select("count(*) as total_lessons,count(DISTINCT horse_id) as used_horse_count,(count(*)/count(DISTINCT horse_id)) as avarage_lessons_per_horse").joins(:horse,:lesson_date_time)
    total_horses = Horse.count

    if params[:horse_id].present?
      horses_report = horses_report.where("lesson_date_time_horses.horse_id = ?", params[:horse_id])
      filter_data = filter_data.where("lesson_date_time_horses.horse_id = ?", params[:horse_id])
    end

    if params[:week].present?
      start_date = parse_date(params[:week])
      end_date = start_date + 7.days
      week = format_of_daterange(start_date, start_date + 6.days)
      horses_report = horses_report.where("lesson_date_times.scheduled_date BETWEEN ? AND ?", start_date, end_date)
      filter_data = filter_data.where("lesson_date_times.scheduled_date BETWEEN ? AND ?", start_date, end_date)
    else
      week = format_of_daterange(Date.today.beginning_of_week - 1.day, Date.today.end_of_week - 1.day)
      start_date = Date.today.beginning_of_week - 1.day
      end_date = Date.today.end_of_week - 1.day
      horses_report = horses_report.where("lesson_date_times.scheduled_date BETWEEN ? AND ?", start_date, end_date)
      filter_data = filter_data.where("lesson_date_times.scheduled_date BETWEEN ? AND ?", start_date, end_date)
    end

    days = []
    record = []
    Date::DAYNAMES.each { |x| days << x }
    days.each_with_index do |day,index|
      horses_report.each do |horse|
        if horse.day == day
          record << horse.horse_id
        end
      end
    end
    hwnd = 0

    record.uniq.each do |x|
      if record.count(x) == 7
        hwnd = hwnd + 1
      end
    end

    more_than_10_count = horses_report.having("count(*) > 10").length

    @horseJson = {}
    horses_report.each do |horse|
      if @horseJson.key?(horse.horse_name)
        @horseJson[horse.horse_name] << horse
      else
        @horseJson[horse.horse_name] = [horse]
      end
    end

    @horseWeeklyJson = {}
    scheduled_date_array = horses_report.pluck(:scheduled_date).map(&:to_date)
    (start_date..end_date).each do |date|
      horses_report.each do |horse|
        if scheduled_date_array.include? date
          if @horseWeeklyJson.key?(horse.scheduled_date)
            # @horseWeeklyJson[horse.scheduled_date] << horse
          else
            @horseWeeklyJson[horse.scheduled_date] = [horse]
          end
        else
          @horseWeeklyJson[date.strftime('%a, %b %d,%Y')] = [{date:date.strftime('%a, %b %d,%Y'),horse_name: horse.horse_name}] unless @horseWeeklyJson.key?(date)
        end
      end
    end

    @horseWeeklyJson = @horseWeeklyJson.sort_by { |k|[Date.strptime(k[0],"%a, %b %d,%Y")]}.to_h


    day_off_count = days_worked_count = days_off_count = 0
    @horseJson.each do |hj|
      day_off_count = day_off_count + ( 7 - hj[1].length)
      days_worked_count = days_worked_count + (hj[1].length)
      days_off_count = days_off_count + ( 7 - hj[1].length)
    end
    render status: 200, json: { week: week, horses_report: @horseJson,horses_weekly_report: @horseWeeklyJson,days_worked_count: days_worked_count,days_off_count: days_off_count,chart_data: { more_than_10_count: more_than_10_count, horse_with_no_days_off: hwnd, day_off_count: day_off_count, total_horses: total_horses, filter_data: filter_data.first } }
  end

  def create
    horse = Horse.new(horse_params)
    if horse.save
      render status: 200, json: { horse: horse,
                                  notice: 'Horse was successfully created.' }
    else
      render status: 400, json: { error: horse.errors.full_messages }
    end
  end

  private

  def horse_params
    params.require(:hourse).permit(:horse_name)
  end
end
