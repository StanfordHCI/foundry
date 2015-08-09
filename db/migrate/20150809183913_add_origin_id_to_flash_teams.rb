class AddOriginIdToFlashTeams < ActiveRecord::Migration
  def change
    add_column :flash_teams, :origin_id, :integer
  end
end
