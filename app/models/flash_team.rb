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
    @data ||= JSON.parse(self.status.presence || default_json).with_indifferent_access
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
      drawn_blue_tasks: [],
      completed_red_tasks: [],
      live_tasks: [],
      paused_tasks: [],
      task_groups: []
    }.to_json
  end

  def status_json
    data = stored_json
    data["flash_teams_json"]['diff'] = {
      changed_events_ids: self.changed_events_ids,
      added_events_ids: self.added_events_ids,
      removed_events_ids: self.removed_events_ids,
      removed_events: self.removed_events
    } if data["flash_teams_json"].present?

    data["flash_teams_json"]['fork'] = true if data["flash_teams_json"].present? && self.fork?
    data
  end

  def flash_teams_json
    stored_json["flash_teams_json"]
  end

  def events
    flash_teams_json.try :fetch, 'events', []
  end

  def events_ids
    self.events.map{|e| e['id']}
  end

  def fork?
    origin.present?
  end

  def source_data
    @source_data ||= JSON.parse self.source_json
  end

  def source_events
    self.source_data['flash_teams_json']['events'] rescue []
  end

  def source_events_ids
    self.source_events.map{|e| e['id']}
  end

  def changed_events_ids
    return [] if source_json.blank? || self.events.blank?
    changed_ids = self.events_ids & source_events_ids
    origin_events = source_events.select{|e| changed_ids.include? e['id']}.group_by{|e| e['id']}
    own_events = self.events.select{|e| changed_ids.include? e['id']}.group_by{|e| e['id']}
    changed_ids.select{|ev_id| !events_equal?(origin_events[ev_id].first, own_events[ev_id].first)}
  end

  def events_equal?(event1, event2)
    prepare(event1) == prepare(event2)
  end

  def prepare(event)
    event.slice(*(event.keys - unnecessary_keys))
  end

  def unnecessary_keys
    ["timer"]
  end

  # should be callde for the FORK team
  def changes_for(event_id)
    event = self.events.detect{|ev| ev['id']}
    source_event = self.source_events.detect{|ev| ev['id']}
    return {'status' => 'new'} if event.present? && source_event.nil?
    return {'status' => 'deleted'} if event.nil?
    (event - source_event).merge({'status' => 'changed'})
  end

  # should be callde for origin team
  def apply_changes(ev_id, changes)
    event = self.events.detect{|ev| ev['id'] == ev_id}
    return if event.nil?
    return if changes.delete('status') != 'changed'
    event.merge changes
  end

  # should be callde for origin team
  def merge_fork_team(team)
    #add new events
    this.events << team.added_events
    #remove deleted events
    this.events.delete_if{|ev| removed_events_ids.include? ev['id'] }
    #call apply_changes for changed events
    changed_events_ids.each{|ev_id| apply_changes(id, team.changes_for(id))}
    #save modified status json
  end

  def added_events_ids
    return [] if source_json.blank? || self.events.blank?
    self.events_ids - source_events_ids
  end

  def added_events
    self.events.select{|ev| added_events_ids.include? ev['id']}
  end

  def removed_events_ids
    return [] if origin.blank?
    source_events_ids - self.events_ids
  end

  def removed_events
    return [] if origin.blank?
    source_events.select{|e| removed_events_ids.include? e['id']}
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
end

