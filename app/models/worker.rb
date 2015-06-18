class Worker < ActiveRecord::Base
	validates :name, :email, :skype_username, :odesk_url, :hourly_rate, :timezone_utc, :panel, presence: true

end
