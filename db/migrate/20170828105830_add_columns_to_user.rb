class AddColumnsToUser < ActiveRecord::Migration
  def change
    add_column :users, :person_id, :integer
    add_column :users, :username, :string
    add_column :users, :join_date, :datetime
    add_column :users, :farm_id, :integer
    add_column :users, :user_type, :integer
  end
end
