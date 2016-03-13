class Status
  attr_accessor :status
   def initialize(_status)
     self.status = _status
   end

  def stored_json
    @stored_json ||= JSON.parse(self.status.presence || default_json).with_indifferent_access
  end

  def flash_teams_json
    stored_json["flash_teams_json"]
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
    @status_json ||= stored_json
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

  def members
    flash_teams_json.try :fetch, 'members', []
  end

  def members_ids
    self.members.map{|m| m['id'] rescue nil}
  end
end
