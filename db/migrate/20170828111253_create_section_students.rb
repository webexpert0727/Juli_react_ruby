class CreateSectionStudents < ActiveRecord::Migration
  def change
    create_table :section_students do |t|
      t.integer :section_id
      t.integer :student_id
      t.integer :item_id
      t.text :notes
      t.timestamps null: false
    end
    add_index :section_students, :section_id
    add_index :section_students, :student_id
    add_index :section_students, :item_id
  end
end
