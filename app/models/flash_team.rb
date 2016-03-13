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

  before_save on: :create do
    self.source_json = origin.status_json.to_json if origin.present?
  end

  def get_team_info
    flash_team_name = self.name
    flash_team_id = self.id
    flash_team_json = self.json.present? ? JSON.parse(self.json) : {}
    author_name = flash_team_json["author"]
    {:flash_team_name => flash_team_name, :flash_team_id => flash_team_id, :author_name => author_name}
  end

  def stored_json
    @stored_json ||= JSON.parse(self.status.presence || default_json).with_indifferent_access
  end

  def default_json
    {
      folders: [],
      flash_teams_json: {
        events: [],
        projectoverview: "",
        members: [],
        interactions: []
      },
      remaining_tasks: [],
      delayed_tasks: [],
      drawn_blue_tasks: [],
      completed_red_tasks: [],
      live_tasks: [],
      paused_tasks: [],
      task_groups: []
    }.to_json
  end

  def status_json
    mr = Merger.new(self.source_json, self.status)

    @status_json ||= stored_json
    @status_json["flash_teams_json"]['diff'] = mr.diff if @status_json["flash_teams_json"].present?

    @status_json["flash_teams_json"]['fork'] = true if @status_json["flash_teams_json"].present? && self.fork?
    @status_json
  end

  def flash_teams_json
    stored_json["flash_teams_json"]
  end

  def events
    flash_teams_json.try :fetch, 'events', []
  end

  def events_ids
    self.events.map{|e| e['id'] rescue nil}
  end

  def fork?
    origin.present?
  end

  # should be called for origin team
  def merge_fork_team(team)
    mr = Merger.new(self.status, team.status, team.source_json)
    res = mr.merge
    self.status = res.master.to_json
    team.source_json  = res.base.to_json
    self.save
  end

  def pull_origin
    mr = Merger.new(self.status, self.origin.status, self.source_json)
    res = mr.merge
    self.status = res.master.to_json
    self.source_json = res.base.to_json

    self.save
  end

  # this function returns the member object from a flash team based on a teamId, taskId and memberId
  def self.getMemberById(teamId, taskId, memId)

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

  def in_process?
    self.status_json["flash_team_in_progress"] && !self.status_json["flash_teams_json"]["paused"]
  end
end

