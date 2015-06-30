class FlashTeam < ActiveRecord::Base
  validates :name, presence: true
  validates :author, presence: true

  has_many :tasks
  has_many :members

  after_save do
    PrivatePub.publish_to("/flash_team/#{self.id}/updated", self.status_json)
  end

  def status_json
    JSON.parse((self.status.presence || '{}'))
  end
end

def get_all_flash_teams
  return FlashTeam.all
end


# this function returns the member object from a flash team based on a teamId, taskId and memberId
def getMemberById(teamId, taskId, memId) 

	flash_team = FlashTeam.find(teamId)
	
	# Extract data from the JSON
    flash_team_status = JSON.parse(flash_team.status)
    flash_team_event = flash_team_status['flash_teams_json']['events'][taskId]
    
    team_members = flash_team_status['flash_teams_json']['members']
	
	# Iterate through them to pick up on events    
    team_members.each do |member|
    	    	
    	if member['id'] == memId
    		return member
    	end
    end

    return -1
end