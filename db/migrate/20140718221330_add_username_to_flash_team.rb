class AddUsernameToFlashTeam < ActiveRecord::Migration
  def change
  
  	# Add the login to the users column 
    add_column :flash_teams, :user_id, :integer
  end
end
