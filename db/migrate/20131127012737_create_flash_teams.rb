class CreateFlashTeams < ActiveRecord::Migration
  def change
    create_table :flash_teams do |t|
      t.string :name
      t.string :author
      t.text :json
      t.text :status
      
      t.text :notification_email_status
      t.timestamps
    end
  end
end
