class CreateProgramTypes < ActiveRecord::Migration
  def change
    create_table :program_types do |t|
      t.string :program_type_name
      t.timestamps null: false
    end
  end
end
