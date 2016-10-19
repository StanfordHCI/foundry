class AddEventsToFlashTeam < ActiveRecord::Migration
  def change
    add_column :flash_teams, :events, :json
  end
end