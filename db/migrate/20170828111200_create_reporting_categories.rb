class CreateReportingCategories < ActiveRecord::Migration
  def change
    create_table :reporting_categories do |t|
      t.string :reporting_category_name
      t.timestamps null: false
    end
  end
end
