class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.string :title
      t.integer :start_hour
      t.integer :end_our
      t.integer :start_minute
      t.integer :end_minute
      t.integer :duration
      t.text :description

      t.timestamps
    end
  end
end
