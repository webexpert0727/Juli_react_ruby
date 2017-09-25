class CreatePayrolls < ActiveRecord::Migration
  def change
    create_table :payrolls do |t|
      t.integer :instructor_id
      t.float :hours
      t.timestamps null: false
    end
    add_index :payrolls, :instructor_id
  end
end
