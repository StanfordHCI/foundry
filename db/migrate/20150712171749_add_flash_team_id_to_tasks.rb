class AddFlashTeamIdToTasks < ActiveRecord::Migration
  def change
    add_column :tasks, :flash_team_id, :integer
  end
end
