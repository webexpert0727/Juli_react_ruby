class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.integer :student_id
      t.integer :product_id
      t.integer :start_count
      t.integer :remain_count
      t.datetime :startdate
      t.datetime :expiry_date
      t.integer :renew
      t.float :price
      t.integer :quantity
      t.integer :tax
      t.float :discount
      t.text :item_notes
      t.integer :related_item_id
      t.integer :invoice_id
      t.timestamps null: false
    end
    add_index :items, :invoice_id
    add_index :items, :product_id
    add_index :items, :student_id
  end
end
