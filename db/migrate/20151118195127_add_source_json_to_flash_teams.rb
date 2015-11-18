class AddSourceJsonToFlashTeams < ActiveRecord::Migration
  def change
    add_column :flash_teams, :source_json, :text
  end
end
