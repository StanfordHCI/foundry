class CreateMemberFolders < ActiveRecord::Migration
  def change
    create_table :member_folders do |t|
      t.string :name
      t.timestamps
    end
  end
end
