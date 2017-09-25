class CreateInstructors < ActiveRecord::Migration
  def change
    create_table :instructors do |t|
      t.integer :person_id
      t.string :instructor_name
      t.integer :ssn
      t.timestamps null: false
    end
    add_index :instructors, :person_id
  end
end
