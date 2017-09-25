class CreateLessonDateTimeSeries < ActiveRecord::Migration
  def change
    create_table :lesson_date_time_series do |t|
      t.integer :frequency, :default => 1
      t.string :period, :default => 'week'
      t.datetime :starttime
      t.datetime :endtime
      t.string :repeat_end_status
      t.text :week_recuring_days
      t.boolean :all_day, :default => false
      t.timestamps null: false
    end
  end
end
