class CreateEnrollmentStatuses < ActiveRecord::Migration
  def change
    create_table :enrollment_statuses do |t|
      t.string :enrollment_status_name

      t.timestamps null: false
    end
  end
end
