class Api::V1::HorsesController < Api::V1::ApiController

  def index
    horses = Horse.all

    render status: 200, json: { horses: horses }
  end

  def horses_report
    horses_report = LessonDateTimeHorse.select(
      "lesson_date_time_horses.horse_id as horse_id,  DAYNAME(lesson_date_times.scheduled_date) as day, count(*) as count, horses.horse_name as horse_name"
    ).joins(
      :horse, :lesson_date_time
    ).group(
      "DAYNAME(lesson_date_times.scheduled_date), lesson_date_time_horses.horse_id")
    .order(
      "lesson_date_times.scheduled_date"
    )


    if params[:horse_id].present?
      horses_report = horses_report.where("lesson_date_time_horses.horse_id = ?", params[:horse_id])
    end

    if params[:week].present?
      start_date = parse_date(params[:week])
      week = format_of_daterange(start_date, start_date + 6.days)
      horses_report = horses_report.where("lesson_date_times.scheduled_date BETWEEN ? AND ?", start_date, start_date + 7.days)
    else
      week = format_of_daterange(Date.today.beginning_of_week - 1.day, Date.today.end_of_week - 1.day)
      horses_report = horses_report.where("lesson_date_times.scheduled_date BETWEEN ? AND ?", Date.today.beginning_of_week - 1.day, Date.today.end_of_week - 1.day)
    end

    @horseJson = {}
    horses_report.each do |horse|
      if @horseJson.key?(horse.horse_name)
        @horseJson[horse.horse_name] << horse
      else
        @horseJson[horse.horse_name] = [horse]
      end
    end


    render status: 200, json: { week: week, horses_report: @horseJson }
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
