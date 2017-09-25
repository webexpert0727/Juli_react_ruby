class AddScheduledEnddateToLessonDateTime < ActiveRecord::Migration
  def change
    add_column :lesson_date_times, :scheduled_end_date, :datetime
  end
end
