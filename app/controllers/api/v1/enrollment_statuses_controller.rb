class Api::V1::EnrollmentStatusesController < Api::V1::ApiController
  def index
    render status: 200, json: { enrollment_statuses: EnrollmentStatus.all }
  end
end
