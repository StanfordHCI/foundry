class CreateActivityLogs < ActiveRecord::Migration
  def change
    create_table :activity_logs do |t|
      t.string :activity_type
      t.string :act_tstamp
      t.text :current_user
      t.string :chat_name
      t.integer :team_id
      t.text :activity_json
      t.string :update_type
      t.timestamps
    end
  end
end
