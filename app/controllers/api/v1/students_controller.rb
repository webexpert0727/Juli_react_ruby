class Api::V1::StudentsController < Api::V1::ApiController
  before_filter :set_student, only: [:show]

  def index
    render status: 200, json: { students: Student.all }
  end

  def create
    student = Student.new(student_params)
    if student.save
      render status: 200, json: { student: student,
                                  notice: 'Student was successfully created.' }
    else
      render status: 400, json: { error: student.errors.full_messages }
    end
  end

  def show
    render status: 200, json: { student: @student }
  end

  private

  def set_student
    @student = Student.find(params[:id])
  end

  def student_params
    params.require(:student).permit(:student_name)
  end
end
