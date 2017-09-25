class CreateStudents < ActiveRecord::Migration
  def change
    create_table :students do |t|
      t.integer :person_id
      t.string  :student_name
      t.timestamps null: false
    end
    add_index :students, :person_id
  end
end
