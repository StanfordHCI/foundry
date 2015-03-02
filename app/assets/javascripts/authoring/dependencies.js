window.dependencyAPI = {
	forward_dependency_map: {}, // map of event_id -> array of all event_ids that are IMMEDIATELY AFTER
	backward_dependency_map: {}, // map of event_id -> array of all event_ids that are IMMEDIATELY BEFORE
	latest_interactions: [],
	/*
	 * Populates the forward and backward dependency maps by iterating over the interactions just once.
	 * Usage:
	 * var dependency_maps = getDependencyMaps(flashTeamsJSON.interactions);
	 * dependency_maps["forward"] gives you the forward map.
	 * dependency_maps["backward"] gives you the backward map.
	 */
	getDependencyMaps: function(interactions){
		if (this.checkInteractionsChanged(interactions)) {
			console.log("Interactions changed from " + this.latest_interactions.join() + " to " + interactions.join());
			// clear the maps because interactions have changed
			this.forward_dependency_map = {};
			this.backward_dependency_map = {};

			// populate the maps
			var num_interactions = interactions.length;
			for (var i=0; i<num_interactions; i++){
				var interaction = interactions[i];
				if (interaction.type == "handoff"){ // we only care about the handoffs
					// add the dependencies in forward direction
					if(!this.forward_dependency_map.hasOwnProperty(interaction.event1)){
						this.forward_dependency_map[interaction.event1] = [parseInt(interaction.event2)];
					} else {
						this.forward_dependency_map[interaction.event1].push(parseInt(interaction.event2));
					}

					// add the dependencies in backward direction
					if(!this.backward_dependency_map.hasOwnProperty(interaction.event2)){
						this.backward_dependency_map[interaction.event2] = [parseInt(interaction.event1)];
					} else {
						this.backward_dependency_map[interaction.event2].push(parseInt(interaction.event1));
					}
				}
			}

			// update the interactions array
			this.latest_interactions = interactions.slice(0);
		}

		return {"forward": this.forward_dependency_map, "backward": this.backward_dependency_map};
	},
	/*
	 * Returns true if the specified interactions array is different from the last
	 * one passed as an argument when calling getDependencyMaps.
	 * Returns false if they are the same.
	 */
	checkInteractionsChanged: function(interactions){
		if (interactions.length != this.latest_interactions.length) return true;

		for (var i = 0; i < interactions.length; i++) {
			if (JSON.stringify(interactions[i]) != JSON.stringify(this.latest_interactions[i])) return true;
		}

		return false;
	},
	/*
	 * Returns an array of event ids that need to be completed BEFORE specified event_id.
	 * Caches the results, so it does not need to re-compute them for the same event_id.
	 */
	getEventsBefore : function(event_id, closure){
		var dependency_maps = this.getDependencyMaps(flashTeamsJSON.interactions);

		if (!dependency_maps["backward"].hasOwnProperty(event_id)){
			return null;
		}

		if (!closure) {
			return dependency_maps["backward"][event_id];
		}

		// TODO(jay): cache this
		var all_events = {};
		this.getEventsHelper(dependency_maps["backward"], dependency_maps["backward"][event_id], all_events);
		var ids = [];
		for (var id in all_events) ids.push(parseInt(id));
		return ids;
	},
	/*
	 * Returns an array of event ids that can only start AFTER specified event_id has completed.
	 * Caches the results, so it does not need to re-compute them for the same event_id.
	 */
	getEventsAfter: function(event_id, closure){
		var dependency_maps = this.getDependencyMaps(flashTeamsJSON.interactions);

		if (!dependency_maps["forward"].hasOwnProperty(event_id)){
			return null;
		}

		if (!closure) {
			return dependency_maps["forward"][event_id];
		}

		// TODO(jay): cache this
		var all_events = {};
		this.getEventsHelper(dependency_maps["forward"], dependency_maps["forward"][event_id], all_events);
		var ids = [];
		for (var id in all_events) ids.push(parseInt(id));
		return ids;
	},
	/*
	 * A helper recursive function that traverses the given map (forward/backward) and finds all event ids that
	 * are after/before the given array of event ids in curr_events.
	 */
	getEventsHelper: function(map, curr_events, all_events){
		for(var i=0; i<curr_events.length; i++){
			var event_id = curr_events[i];
			all_events[event_id] = true;
			if(map.hasOwnProperty(event_id)) {
				this.getEventsHelper(map, map[event_id], all_events);
			}
		}
	},
	/*
	 * Checks whether adding a handoff from event_1_id to event_2_id will lead to the creation of a
	 * handoff cycle. If so, returns true. Else, returns false.
	 */
	checkCycle: function(event_1_id, event_2_id){
		// check if there is already handoff link from event2 to event1
		// if so, adding a handoff link from event1 to event2 will create a cycle

		var dependency_maps = this.getDependencyMaps(flashTeamsJSON.interactions);
		return this.checkCycleHelper(dependency_maps["forward"], dependency_maps["forward"][event_2_id], event_1_id);
	},
	/*
	 * Helper recursive function to check cycles in the handoffs
	 */
	checkCycleHelper: function(forward_map, next, target){
		if (!next){
			return false;
		}
		for(var i=0; i<next.length; i++){
			var event_id = next[i];
			if (event_id == target){
				return true;
			}
			if (forward_map.hasOwnProperty(event_id)){
				var events_after = forward_map[event_id];
				var found = this.checkCycleHelper(forward_map, events_after, target);
				if(found){
					return true;
				}
			}
		}
		return false;
	}
};



//this function returns the ids of the events immidiately before the current event (groupNum).
function events_immediately_before(groupNum){
 var ids_immediately_before=[];
 var interactions = flashTeamsJSON["interactions"];
 for(var i = 0; i<interactions.length; i++){
 	if(interactions[i].type != "handoff")
 		continue;
 	if (parseInt(interactions[i].event2) == groupNum){
 		ids_immediately_before.push(parseInt(interactions[i].event1));
 	}	
 }
 return ids_immediately_before;
}

function events_in_collaboration(groupNum){
	var collab_ids=[];
	var interactions = flashTeamsJSON["interactions"];
	for(var i = 0; i<interactions.length; i++){
		if(interactions[i].type != "collaboration")
			continue;

	 	if (parseInt(interactions[i].event2) == groupNum){
	 		collab_ids.push(parseInt(interactions[i].event1));
	 	}
	 	
	 	else if (parseInt(interactions[i].event1) == groupNum){
	 		collab_ids.push(parseInt(interactions[i].event2));
	 	}	
 	}
 	return collab_ids;
}