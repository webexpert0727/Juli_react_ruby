class Api::V1::InstructorsController < Api::V1::ApiController
 
  def index
    render status: 200, json: { instructors: Instructor.all }
  end

  def create
    instructor = Instructor.new(instructor_params)
    if instructor.save
      render status: 200, json: { instructor: instructor,
                                  notice: 'Instructor successfully created.' }
    else
      render status: 400, json: { error: instructor.errors.full_messages }
    end
  end

  private

  def instructor_params
    params.require(:instructor).permit(:instructor_name, :ssn)
  end
end
