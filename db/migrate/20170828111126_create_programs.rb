class CreatePrograms < ActiveRecord::Migration
  def change
    create_table :programs do |t|
      t.string :program_name
      t.text :program_desc
      t.integer :program_type_id
      t.integer :reporting_category_id
      t.integer :duration
      t.integer :default_product_id
      t.integer :default_instructor_id
      t.integer :farm_id
      t.timestamps null: false
    end
    add_index :programs, :farm_id
    add_index :programs, :program_type_id
  end
end
