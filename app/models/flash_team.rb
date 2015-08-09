class FlashTeam < ActiveRecord::Base
  validates :name, presence: true
  validates :author, presence: true

  has_many :tasks
  has_many :members
  belongs_to :origin, class_name: 'FlashTeam'
  has_many :forks, class_name: 'FlashTeam', foreign_key: :origin_id
  belongs_to :user

  after_save do
    PrivatePub.publish_to("/flash_team/#{self.id}/updated", self.status_json)
    PrivatePub.publish_to("/flash_team/#{self.id}/info", self.get_team_info)
  end

  def get_team_info
    flash_team_name = self.name
    flash_team_id = self.id
    flash_team_json = self.json.present? ? JSON.parse(self.json) : {}
    author_name = flash_team_json["author"]
    {:flash_team_name => flash_team_name, :flash_team_id => flash_team_id, :author_name => author_name}
  end

  def status_json
    JSON.parse((self.status.presence || '{}'))
  end

  def fork?
    origin.present?
  end
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
