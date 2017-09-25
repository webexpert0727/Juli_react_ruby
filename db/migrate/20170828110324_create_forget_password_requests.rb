class CreateForgetPasswordRequests < ActiveRecord::Migration
  def change
    create_table :forget_password_requests do |t|
      t.integer :request_id
      t.string :useremail
      t.string :resetcode
      t.timestamps null: false
    end
    add_index :forget_password_requests, :request_id
  end
end
