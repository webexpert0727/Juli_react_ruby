class Api::V1::LessonPeopleController < Api::V1::ApiController
  before_filter :set_lesson_date_time, only: [:index]

  def index
    render status: 200, json: { lesson_people: @lesson_date_time.lesson_people }
  end

  private

  def set_lesson_date_time
    @lesson_date_time = LessonDateTime.find(params[:lesson_date_time])
  end
end
