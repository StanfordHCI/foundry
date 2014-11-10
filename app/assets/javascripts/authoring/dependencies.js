window.dependencyAPI = {
	forward_dependency_map: {},
	backward_dependency_map: {},
	cache_events_before: {},
	cache_events_after: {},
	buildDependencyHashmap: function(interactions){
		var num_interactions = interactions.length;
		for (var i=0; i<num_interactions; i++){
			if (interactions[i].type == "handoff"){
				if(!this.forward_dependency_map.hasOwnProperty(interaction.event1)){
					this.forward_dependency_map[interaction.event1] = [interaction.event2];
				} else {
					this.forward_dependency_map[interaction.event1].push(interaction.event2);
				}

				if(!this.backward_dependency_map.hasOwnProperty(interaction.event2)){
					this.backward_dependency_map[interaction.event2] = [interaction.event1];
				} else {
					this.backward_dependency_map[interaction.event2].push(interaction.event1);
				}
			}
		}
	},
	checkCycle: function(event_1_id, event_2_id){
		// check if there is already handoff link from event2 to event1
		// if so, adding a handoff link from event1 to event2 will create a cycle
		return checkCycleHelper(this.forward_dependency_map[event_2_id], event_1_id);
	},
	checkCycleHelper: function(next, target){
		for(var i=0; i<next.length; i++){
			var event_id = next[i];
			if (event_id == target){
				return true;
			}
			if (this.forward_dependency_map.hasOwnProperty(event_id)){
				var events_after = this.forward_dependency_map[event_id];
				var found = checkCycleHelper(events_after);
				if(found){
					return true;
				}
			}
		}
		return false;
	},
	getEventsBefore : function(event_id){
		// i.e. events that need to be completed BEFORE specified event_id
		if (this.cache_events_before.hasOwnProperty(event_id)){
			return this.cache_events_before[event_id];
		}

		var all_events = [];
		getEventsHelper(this.backward_dependency_map, this.backward_dependency_map[event_id], all_events);
		this.cache_events_before[event_id] = all_events;
		return all_events;
	},
	getEventsAfter: function(event_id){
		// i.e. events that can only start AFTER specified event_id has finished
		if (this.cache_events_after.hasOwnProperty(event_id)){
			return this.cache_events_after[event_id];
		}

		var all_events = [];
		getEventsHelper(this.forward_dependency_map, this.forward_dependency_map[event_id], all_events);
		this.cache_events_after[event_id] = all_events;
		return all_events;
	},
	getEventsHelper: function(map, curr_events, all_events){
		for(var i=0; i<curr_events.length; i++){
			var event_id = curr_events[i];
			all_events.push(event_id);
			if(map.hasOwnProperty(event_id)) {
				getEventsHelper(map, map[event_id], all_events);
			}
		}
	}
};