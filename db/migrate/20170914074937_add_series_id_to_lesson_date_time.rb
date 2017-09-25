class AddSeriesIdToLessonDateTime < ActiveRecord::Migration
  def change
    add_column :lesson_date_times, :lesson_date_time_series_id, :integer
    add_index :lesson_date_times, :lesson_date_time_series_id
  end
end
