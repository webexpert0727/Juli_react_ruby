class CreateLessonPeople < ActiveRecord::Migration
  def change
    create_table :lesson_people do |t|
      t.integer :student_id
      t.integer :horse_id
      t.integer :item_id
      t.integer :lesson_date_time_id
      t.integer :paid
      t.integer :enrollment_status_id
      t.string :payment_image_file
      t.text :enrollment_notes
      t.datetime :date_enrolled
      t.integer :makeup_lesson
      t.integer :notification_level_id
      t.text :instructor_notes_private
      t.text :instructor_notes_public
      t.integer :farm_id
      t.timestamps null: false
    end
    add_index :lesson_people, :student_id
    add_index :lesson_people, :horse_id
    add_index :lesson_people, :item_id
    add_index :lesson_people, :lesson_date_time_id
    add_index :lesson_people, :enrollment_status_id
  end
end
