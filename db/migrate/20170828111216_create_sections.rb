class CreateSections < ActiveRecord::Migration
  def change
    create_table :sections do |t|
      t.string :section_name
      t.string :location
      t.datetime :startdate
      t.integer :day_of_week
      t.time :starttime
      t.integer :duration
      t.time :endtime
      t.string :repeat_type
      t.integer :repeat_number
      t.datetime :enddate
      t.integer :instructor_id
      t.integer :default_product_id
      t.integer :program_id
      t.boolean :is_section_enrollment
      t.integer :max_enrollment
      t.integer :current_enrollment
      t.integer :farm_id
      t.string :stringnum
      t.timestamps null: false
    end
    add_index :sections, :instructor_id
    add_index :sections, :program_id
    add_index :sections, :farm_id
  end
end
