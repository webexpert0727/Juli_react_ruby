class CreateLessonDateTimes < ActiveRecord::Migration
  def change
    create_table :lesson_date_times do |t|
      t.string :name
      t.datetime :scheduled_date
      t.time :scheduled_starttime
      t.integer :duration
      t.time :scheduled_endtime
      t.integer :instructor_id
      t.integer :location_id
      t.integer :default_product_id
      t.integer :max_enrollment
      t.integer :number_scheduled
      t.integer :section_id
      t.integer :lesson_status_id
      t.text :lesson_notes
      t.string :stringnum
      t.integer :farm_id
      t.timestamps null: false
    end
    add_index :lesson_date_times, :instructor_id
    add_index :lesson_date_times, :location_id
    add_index :lesson_date_times, :section_id
    add_index :lesson_date_times, :farm_id
  end
end
