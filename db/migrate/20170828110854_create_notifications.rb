class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
      t.integer :farm_id
      t.string :notification_name
      t.text :notification_description
      t.boolean :active
      t.timestamps null: false
    end
    add_index :notifications, :farm_id
  end
end
