class User < ActiveRecord::Base

	# each user can have many flash teams
	has_many :flash_teams

	
	# usernames must be unique and at least 3 characters long
    validates :username, uniqueness: true, length: { minimum: 3}
    
end
