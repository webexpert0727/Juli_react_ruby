class CreateProductPrograms < ActiveRecord::Migration
  def change
    create_table :product_programs do |t|
      t.integer :product_id
      t.integer :program_id
      t.timestamps null: false
    end
    add_index :product_programs, :product_id
    add_index :product_programs, :program_id
  end
end
