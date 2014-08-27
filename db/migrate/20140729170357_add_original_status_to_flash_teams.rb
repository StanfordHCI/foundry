class AddOriginalStatusToFlashTeams < ActiveRecord::Migration
  def change
    add_column :flash_teams, :original_status, :text
  end
end
