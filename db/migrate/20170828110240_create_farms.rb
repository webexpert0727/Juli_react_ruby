class CreateFarms < ActiveRecord::Migration
  def change
    create_table :farms do |t|
      t.string :farm_name
      t.string :farm_name2
      t.string :address
      t.string :address2
      t.integer :farm_tax 
      t.integer :tax_id 
      t.string :logo 
      t.string :blob
      t.string :website
      t.string :email
      t.string :invoicecc_email
      t.string :client_code
      t.string :user_date_format
      t.string :currency_symbol
      t.string :currency_code 
      t.integer :date_format_id
      t.integer :number_format_id
      t.integer :invoice_start_num
      t.text :invoice_notes
      t.boolean :active
      t.timestamps null: false
    end
  end
end
