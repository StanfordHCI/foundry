class User < ActiveRecord::Base
	# each user can have many flash teams
	has_many :flash_teams
    has_many :pull_requests
	
	# usernames must be unique and at least 3 characters long
    validates :username, uniqueness: true, length: { minimum: 3}
    validates :password, length: { minimum: 6 }
    
    has_secure_password
end
