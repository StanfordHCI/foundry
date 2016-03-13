class AddDataJsonToTasks < ActiveRecord::Migration
  def change
    add_column :tasks, :data_json, :text
    add_column :tasks, :flash_team_id, :integer
  end
end
