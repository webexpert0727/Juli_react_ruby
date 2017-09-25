class Api::V1::LessonStatusesController < Api::V1::ApiController
  def index
    render status: 200, json: { lesson_status: LessonStatus.all }
  end
end
