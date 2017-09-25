class CreateSectionHorses < ActiveRecord::Migration
  def change
    create_table :section_horses do |t|
      t.integer :section_id
      t.integer :horse_id
      t.text :notes
      t.timestamps null: false
    end
    add_index :section_horses, :section_id
    add_index :section_horses, :horse_id
  end
end
