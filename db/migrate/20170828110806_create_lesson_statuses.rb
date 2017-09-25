class CreateLessonStatuses < ActiveRecord::Migration
  def change
    create_table :lesson_statuses do |t|
      t.string :lesson_status_name
      t.text :lesson_status_desc
      t.timestamps null: false
    end
  end
end
