class AddUserIdToLessonDateTime < ActiveRecord::Migration
  def change
    add_column :lesson_date_times, :user_id, :integer
  end
end
