class FlashTeam < ActiveRecord::Base
  validates :name, presence: true
  validates :author, presence: true

  has_many :tasks
  has_many :members

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
    parsed_data = default_json.deep_merge JSON.parse((self.status.presence || '{}'))
    parsed_data['flash_teams_json']['events'] = self.tasks.map(&:get_data)
    parsed_data
  end

  def default_json
    {
      "task_groups" => [],
      "delayed_tasks_time" => [],
      "dri_responded" => [],
      "interactions" => [],
      "members" => [],
      "folders" => [],
      "live_tasks" => [],
      "paused_tasks" => [],
      "remaining_tasks" => [],
      "delayed_tasks" => [],
      "drawn_blue_tasks" => [],
      "completed_red_tasks" => [],
      "flash_teams_json" => {
        "events" => nil,
        "interactions" => [],
        "drawn_blue_tasks" => [],
        "members" => [],
        "folders" => []
      }
    }
  end

  def status=(data)
    parsed_data = JSON.parse(data)
    events = parsed_data['flash_teams_json']['events']
    events.each do |event|
      task = self.tasks.find_or_initialize_by_id event['_id']
      if task.data_json != event.to_json
        task.data_json = event.to_json
        task.save
      end
    end
    parsed_data['flash_teams_json'].delete 'events'
    write_attribute :status, parsed_data.to_json
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
