class Api::V1::LessonDateTimesController < Api::V1::ApiController
  before_filter :set_lesson_date_time, only: [:show, :update, :destroy]
  before_filter :delete_horses ,only: [:update]

  def index
    render status: 200, json: { lesson_date_times: current_user.get_lessons }
  end

  def create
    obj = if params[:lesson_date_time][:is_recuring].eql?('true')
            current_user.lesson_date_time_series.new(lesson_date_time_params)
          else
            current_user.lesson_date_times.new(lesson_date_time_params)
          end
    if obj.save
      render status: 200, json: { added_lesson_date_times:
                                  current_user.get_lessons,
                                  notice: 'Lesson Date successfully created.' }
    else
      render status: 400, json: { error: obj.errors.full_messages }
    end
  end

  def show
    render status: 200, json: { lesson_date_time: @lesson_date_time.to_json }
  end

  def update
    begin
      if params[:lesson_date_time][:recurring_update_option] == 'all_occurrence'
        @lesson_date_times = @lesson_date_time.lesson_date_time_series.lesson_date_times
        @lesson_date_time.update_lesson_date_times(@lesson_date_times, lesson_date_time_params)
      elsif params[:lesson_date_time][:recurring_update_option] == 'future_occurrence'
        @lesson_date_times = @lesson_date_time.lesson_date_time_series.lesson_date_times.where('scheduled_date > ?',   @lesson_date_time.scheduled_date)
        @lesson_date_time.update_lesson_date_times(@lesson_date_times, lesson_date_time_params)
      else
        @lesson_date_time.attributes = lesson_date_time_params
        @lesson_date_time.save
      end
      render status: 200, json: { lesson_date_times: current_user.get_lessons, notice: 'successfully updated' }
    rescue => e
      render status: 400, json: { error: @lesson_date_time.errors.full_messages }
    end
  end  

  def destroy
    begin 
      if params[:delete_all] == 'true'
        @lesson_date_time.lesson_date_time_series.destroy
      elsif params[:delete_all] == 'future'
        @lesson_date_times = @lesson_date_time.lesson_date_time_series.lesson_date_times.where("scheduled_date > ?",   @lesson_date_time.scheduled_date)
        @lesson_date_time.lesson_date_time_series.lesson_date_times.delete(@lesson_date_times)
      else
        @lesson_date_time.destroy
      end
      render status: 200, json: { notice: 'delete successfully',
                                  lesson_date_times: current_user.get_lessons }
    rescue => e
      render status: 400, json: { error: @lesson_date_time.errors.full_messages }
    end
  end


  private

  def set_lesson_date_time
    @lesson_date_time = LessonDateTime.find(params[:id])
  end

  def delete_horses
    @lesson_date_time.lesson_date_time_horses.destroy_all
    @lesson_date_time.lesson_people.destroy_all
  end

  def lesson_date_time_params
    params.require(:lesson_date_time).permit(:name, :scheduled_date,
      :scheduled_starttime, :duration, :scheduled_endtime, :instructor_id,
      :location_id, :default_product_id, :max_enrollment, :number_scheduled,
      :section_id, :lesson_status_id, :lesson_notes, :stringnum, :farm_id,
      :scheduled_end_date,:starttime,:repeat_end_status, :endtime,:all_day,
      :is_recuring, :period, :frequency, :occurence, :is_data_copied,
      week_recuring_days:[],lesson_date_time_horses_attributes: [:lesson_date_time_id,
      :horse_id],lesson_people_attributes: [:horse_id,:student_id,:paid,
      :enrollment_status_id])
  end
end
