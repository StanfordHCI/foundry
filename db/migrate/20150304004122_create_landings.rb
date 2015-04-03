class CreateLandings < ActiveRecord::Migration
  def change
    create_table :landings do |t|
      t.integer :id_team
      t.integer :id_event
      t.string :task_member
      t.string :email
      t.datetime :start_date_time
      t.datetime :end_date_time
      t.integer :queuePosition
      t.string :status
      t.timestamps
    end
  end
end
