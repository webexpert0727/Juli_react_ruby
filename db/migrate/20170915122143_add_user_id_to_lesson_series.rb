class AddUserIdToLessonSeries < ActiveRecord::Migration
  def change
    add_column :lesson_date_times, :is_recuring, :boolean, default: false
    add_column :lesson_date_time_series, :user_id, :integer
    add_index :lesson_date_time_series, :user_id
  end
end
