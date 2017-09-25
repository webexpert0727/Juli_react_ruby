class CreateInvoices < ActiveRecord::Migration
  def change
    create_table :invoices do |t|
      t.datetime :invoice_date
      t.integer :student_id
      t.integer :paid
      t.timestamps null: false
    end
    add_index :invoices, :student_id
  end
end
