class CreateLessonDateTimeHorses < ActiveRecord::Migration
  def change
    create_table :lesson_date_time_horses do |t|
      t.integer :lesson_date_time_id
      t.integer :horse_id
      t.text :notes
      t.timestamps null: false
    end
    add_index :lesson_date_time_horses, :lesson_date_time_id
    add_index :lesson_date_time_horses, :horse_id
  end
end
