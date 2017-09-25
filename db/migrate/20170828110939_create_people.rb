class CreatePeople < ActiveRecord::Migration
  def change
    create_table :people do |t|
      t.string :person_name
      t.string :street_address1
      t.string :street_address2
      t.string :city
      t.string :state_province
      t.string :country
      t.integer :farm_id
      t.timestamps null: false
    end
    add_index :people, :farm_id
  end
end
