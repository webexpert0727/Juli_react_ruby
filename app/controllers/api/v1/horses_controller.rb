class Api::V1::HorsesController < Api::V1::ApiController

  def index
    horses = LessonDateTimeHorse.select(
      "lesson_date_time_horses.horse_id as horse_id,  DAYNAME(lesson_date_times.scheduled_date) as day, count(*) as count, horses.horse_name as horse_name"
    ).joins(
      :horse, :lesson_date_time
    ).group(
      "DAY(lesson_date_times.scheduled_date), lesson_date_time_horses.horse_id").order("lesson_date_times.scheduled_date"
    ).where(
      "lesson_date_times.scheduled_date BETWEEN ? AND ?", Date.today.beginning_of_week, Date.today.end_of_week
    )

    render status: 200, json: { horses: horses }
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
