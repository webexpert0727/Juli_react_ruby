class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.string :location_name
      t.integer :farm_id
      t.timestamps null: false
    end
    add_index :locations, :farm_id
  end
end
