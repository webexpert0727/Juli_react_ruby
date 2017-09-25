class CreateProducts < ActiveRecord::Migration
  def change
    create_table :products do |t|
      t.string :product_name
      t.text :product_desc
      t.integer :product_price
      t.integer :product_count
      t.integer :renew_month
      t.integer :renew_week
      t.integer :farm_id
      t.boolean :active
      t.string :type
      t.timestamps null: false
    end
    add_index :products, :farm_id
  end
end
