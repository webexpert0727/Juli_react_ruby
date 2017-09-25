class AddUserToInstructorAndStudent < ActiveRecord::Migration
  def change
    add_column :instructors, :user_id, :integer
    add_column :students, :user_id, :integer
  end
end
