class AddDataJsonToTasks < ActiveRecord::Migration
  def change
    add_column :tasks, :data_json, :text, default: "{}"
  end
end
