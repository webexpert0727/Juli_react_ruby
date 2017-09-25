class Api::V1::LessonDateTimeHorsesController < Api::V1::ApiController
  before_filter :set_lesson_date_time
 
  def index
    render status: 200, json: { lesson_date_time_horses:
                                @lesson_date_time.lesson_date_time_horses }
  end

  private

  def set_lesson_date_time
    @lesson_date_time = LessonDateTime.find(params[:lesson_date_time_id])
  end
end
