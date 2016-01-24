class Merger
  attr_accessor :master, :branch, :base
  def initialize(_master, _branch, _base=nil)
    self.master, self.branch = Status.new(_master), Status.new(_branch)
    self.base = _base.present? ? Status.new(_base) : Status.new(_master)
  end

  def merge
    #add new events
    added_events.each{|new_ev| master.events << new_ev if !master.events_ids.include? new_ev['id']}
    added_events.each{|new_ev| base.events << new_ev if !base.events_ids.include? new_ev['id']}
    #remove deleted events
    master.events.delete_if{|ev| removed_events_ids.include? ev['id'] }
    base.events.delete_if{|ev| removed_events_ids.include? ev['id'] }
    #call apply_changes for changed events
    changed_events_ids.each{|ev_id| apply_changes(ev_id, changes_for(ev_id))}
    changed_events_ids.each{|ev_id| apply_changes(ev_id, changes_for(ev_id))}
    #merge members
    added_members.each{|new_m| master.members << new_m if !master.members_ids.include? new_m['id']}
    added_members.each{|new_m| base.members << new_m if !base.members_ids.include? new_m['id']}
    #remove deleted members
    master.members.delete_if{|m| removed_members_ids.include? m['id'] }
    base.members.delete_if{|m| removed_members_ids.include? m['id'] }
    #return modified status json
    OpenStruct.new( master: master.status_json, base: base.status_json)
  end

  def diff
    {
      changed_events_ids: self.changed_events_ids,
      added_events_ids: self.added_events_ids,
      removed_events_ids: self.removed_events_ids,
      removed_events: self.removed_events,
      added_members: added_members
    }
  end

  def changed_events_ids
    return [] if base.events.blank? || branch.events.blank?
    changed_ids = branch.events_ids & base.events_ids
    master_events = base.events.select{|e| changed_ids.include? e['id']}.group_by{|e| e['id']}
    branch_events = branch.events.select{|e| changed_ids.include? e['id']}.group_by{|e| e['id']}
    changed_ids.select{|ev_id| !events_equal?(master_events[ev_id].first, branch_events[ev_id].first)}
  end

  def events_equal?(event1, event2)
    prepare(event1) == prepare(event2)
  end

  def added_events_ids
    return [] if base.stored_json.blank? || branch.events.blank?
    branch.events_ids - base.events_ids
  end

  def added_events
    branch.events.select{|ev| added_events_ids.include? ev['id']}
  end

  def removed_events_ids
    return [] if branch.stored_json.blank?
    base.events_ids - branch.events_ids
  end

  def removed_events
    return [] if base.events.blank?
    base.events.select{|e| removed_events_ids.include? e['id']}
  end

  # should be called for origin team
  def apply_changes(ev_id, changes)
    event = master.events.detect{|ev| ev['id'] == ev_id}
    return if event.nil?
    return if changes.delete('status') != 'changed'
    event.merge! changes
  end

  # should be called for the FORK team
  def changes_for(event_id)
    event = branch.events.detect{|ev| ev['id'] == event_id}
    master_event = base.events.detect{|ev| ev['id'] == event_id}
    return {'status' => 'new'} if event.present? && master_event.nil?
    return {'status' => 'deleted'} if event.nil?
    (event.to_a - master_event.to_a).to_h.merge({'status' => 'changed'})
  end

  def prepare(event)
    event.slice(*(event.keys - unnecessary_keys))
  end

  def unnecessary_keys
    ["timer"]
  end

  def added_members_ids
    return [] if branch.members.blank?
    branch.members_ids - base.members_ids
  end

  def added_members
    branch.members.select{|m| added_members_ids.include? m['id']}
  end

  def removed_members_ids
    return [] if base.members.blank?
    base.members_ids - branch.members_ids
  end
end
