class Worker < ActiveRecord::Base
	validates :name, :email, :skype_username, :odesk_url, :timezone_utc, :panel, presence: true

end
