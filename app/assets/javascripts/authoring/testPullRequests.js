// ASSUMPTIONS
// All ids are based on timestamps, not sequential numbers

// Tests for events

// No conflicting locations due to different Y
var test_EventsNotOverlap_DifferentY = function(){
    var errors = [];
    var ancestor = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}]};
    var master = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "1", startMin: 0, duration: 45}]};
    var branch = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 3, y: 50, startHr: "1", startMin: 0, duration: 45}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length > 0){
        errors.push("Expected no conflicts, but got some: " + JSON.stringify(diffed.conflicts));
    }

    var patched = xdiff.patchTeam(diffed.diffs, ancestor);
    if(patched.events.length != 3){
        errors.push("Expected 3 events, actual: " + patched.events.length);
    }
    console.log(patched.events);

    var expected = [{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 3, y: 50, startHr: "1", startMin: 0, duration: 45}];
    for (var k in expected) {
        var found = false;
        for (var j in patched.events){
            if (JSON.stringify(patched.events[j]) == JSON.stringify(expected[k])) {
                found = true;
                break;
            }
        }
        if (!found){
            errors.push("Event with id " + expected[k].id + " expected but not found in patched result");
        }
    }

    console.log("------ EVENT TEST: each adds event separately, with NO location overlap due to different Y ------");
    console.log(errors.length == 0 ? "PASS" : "FAIL");
    for (var k in errors) {
        console.log(errors[k]);
    }
    console.log("------------------------------------------------------------");
    return errors.length == 0;
};

// No conflicting locations on same y, one way
var test_EventsNotOverlap_SameY_OneWay = function(){
    var errors = [];
    var ancestor = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}]};
    var master = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "1", startMin: 0, duration: 45}]};
    var branch = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 3, y: 5, startHr: "2", startMin: 0, duration: 45}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length > 0){
        errors.push("Expected no conflicts, but got some: " + JSON.stringify(diffed.conflicts));
    }

    var patched = xdiff.patchTeam(diffed.diffs, ancestor);
    if(patched.events.length != 3){
        errors.push("Expected 3 events, actual: " + patched.events.length);
    }
    console.log("RECEIVED PATCHES: ");
    console.log(patched.events);

    var expected = [{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 3, y: 5, startHr: "2", startMin: 0, duration: 45}];
    for (var k in expected) {
        var found = false;
        for (var j in patched.events){
            if (JSON.stringify(patched.events[j]) == JSON.stringify(expected[k])) {
                found = true;
                break;
            }
        }
        if (!found){
            errors.push("Event with id " + expected[k].id + " expected but not found in patched result");
        }
    }

    console.log("------ EVENT TEST: each adds event separately, with NO location overlap, one way ------");
    console.log(errors.length == 0 ? "PASS" : "FAIL");
    for (var k in errors) {
        console.log(errors[k]);
    }
    console.log("------------------------------------------------------------");
    return errors.length == 0;
};

// No conflicting locations on same y, other way
var test_EventsNotOverlap_SameY_OtherWay = function(){
    var errors = [];
    var ancestor = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}]};
    var master = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "2", startMin: 0, duration: 45}]};
    var branch = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 3, y: 5, startHr: "1", startMin: 0, duration: 45}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length > 0){
        errors.push("Expected no conflicts, but got some: " + JSON.stringify(diffed.conflicts));
    }

    var patched = xdiff.patchTeam(diffed.diffs, ancestor);
    if(patched.events.length != 3){
        errors.push("Expected 3 events, actual: " + patched.events.length);
    }

    var expected = [{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "2", startMin: 0, duration: 45}, {id: 3, y: 5, startHr: "1", startMin: 0, duration: 45}];
    for (var k in expected) {
        var found = false;
        for (var j in patched.events){
            if (JSON.stringify(patched.events[j]) == JSON.stringify(expected[k])) {
                found = true;
                break;
            }
        }
        if (!found){
            errors.push("Event with id " + expected[k].id + " expected but not found in patched result");
        }
    }

    console.log("------ EVENT TEST: each adds event separately, with NO location overlap, other way ------");
    console.log(errors.length == 0 ? "PASS" : "FAIL");
    for (var k in errors) {
        console.log(errors[k]);
    }
    console.log("------------------------------------------------------------");
    return errors.length == 0;
};

// Have conflicting locations
var test_EventsOverlap = function(){
    var errors = [];
    var ancestor = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}]};
    
    // two events exactly overlap on same y
    var master = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "1", startMin: 0, duration: 45}]};
    var branch = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 3, y: 5, startHr: "1", startMin: 0, duration: 45}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length != 1){
        errors.push("Expected 1 conflict, but got " + diffed.conflicts.length);
    } else if (diffed.conflicts[0].type != EVENTS_OVERLAP_CONFLICT) {
        errors.push("Expected \"" + EVENTS_OVERLAP_CONFLICT + "\" but got " + diffed.conflicts[0].type);
    }

    // one event complete subset of other
    var master = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "1", startMin: 0, duration: 45}]};
    var branch = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 3, y: 5, startHr: "1", startMin: 15, duration: 25}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length != 1){
        errors.push("Expected 1 conflict, but got " + diffed.conflicts.length);
    } else if (diffed.conflicts[0].type != EVENTS_OVERLAP_CONFLICT) {
        errors.push("Expected \"" + EVENTS_OVERLAP_CONFLICT + "\" but got " + diffed.conflicts[0].type);
    }

    // one event complete subset of other, flipped
    var master = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "1", startMin: 15, duration: 25}]};
    var branch = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 3, y: 5, startHr: "1", startMin: 0, duration: 45}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length != 1){
        errors.push("Expected 1 conflict, but got " + diffed.conflicts.length);
    } else if (diffed.conflicts[0].type != EVENTS_OVERLAP_CONFLICT) {
        errors.push("Expected \"" + EVENTS_OVERLAP_CONFLICT + "\" but got " + diffed.conflicts[0].type);
    }

    // two events partially overlap on same y
    var master = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "1", startMin: 0, duration: 45}]};
    var branch = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 3, y: 5, startHr: "1", startMin: 30, duration: 45}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length != 1){
        errors.push("Expected 1 conflict, but got " + diffed.conflicts.length);
    } else if (diffed.conflicts[0].type != EVENTS_OVERLAP_CONFLICT) {
        errors.push("Expected \"" + EVENTS_OVERLAP_CONFLICT + "\" but got " + diffed.conflicts[0].type);
    }

    // two events partially overlap on same y, flipped
    var master = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "1", startMin: 30, duration: 45}]};
    var branch = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 3, y: 5, startHr: "1", startMin: 0, duration: 45}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length != 1){
        errors.push("Expected 1 conflict, but got " + diffed.conflicts.length);
    } else if (diffed.conflicts[0].type != EVENTS_OVERLAP_CONFLICT) {
        errors.push("Expected \"" + EVENTS_OVERLAP_CONFLICT + "\" but got " + diffed.conflicts[0].type);
    }

    console.log("------ EVENT TEST: each adds event separately, WITH location overlap ------");
    console.log(errors.length == 0 ? "PASS" : "FAIL");
    for (var k in errors) {
        console.log(errors[k]);
    }
    console.log("------------------------------------------------------------");
    return errors.length == 0;
};

// Tests for members

// Each separately added a new member
var test_NewMember = function(){
    var errors = [];
    var ancestor = {"members":[{id: 1}]};
    var master = {"members":[{id: 1}, {id: 2}]};
    var branch = {"members":[{id: 1}, {id: 3}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length > 0){
        errors.push("Expected no conflicts, but got some: " + JSON.stringify(diffed.conflicts));
    }

    var patched = xdiff.patchTeam(diffed.diffs, ancestor);
    if(patched.members.length != 3){
        errors.push("Expected 3 members, actual: " + patched.members.length);
    }

    var expected = [{id: 1}, {id: 2}, {id: 3}];
    for (var k in expected) {
        var found = false;
        for (var j in patched.members){
            if (JSON.stringify(patched.members[j]) == JSON.stringify(expected[k])) {
                found = true;
                break;
            }
        }
        if (!found){
            errors.push("Member with id " + expected[k].id + " expected but not found in patched result");
        }
    }

    console.log("------ MEMBERS TEST: each adds member separately ------");
    console.log(errors.length == 0 ? "PASS" : "FAIL");
    for (var k in errors) {
        console.log(errors[k]);
    }
    console.log("------------------------------------------------------------");
    return errors.length == 0;
};

// Tests for interactions

// Each separately added the same collaboration between same pair of events
// Events are unchanged
// Since it's a collaboration, it is possible branch did 1->2 and master did 2->1, so we need to handle that case as well
// Our algorithm should choose the one which goes from lower id to higher id
// in this case
var test_NewCollaboration_SameEventPair = function(){
    var errors = [];
    var ancestor = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 10, startHr: "1", startMin: 30, duration: 45}]};
    var master = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 10, startHr: "1", startMin: 30, duration: 45}], "interactions":[{id: 33, event1: 1, event2: 2, type: "collaboration"}]};
    var branch = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 10, startHr: "1", startMin: 30, duration: 45}], "interactions":[{id: 22, event1: 2, event2: 1, type: "collaboration"}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length > 0){
        errors.push("Expected no conflicts, but got some: " + JSON.stringify(diffed.conflicts));
    }

    var patched = xdiff.patchTeam(diffed.diffs, ancestor);
    if(patched.interactions.length != 1){
        errors.push("Expected 1 collaboration, actual: " + patched.interactions.length);
    }

    var expected = [{id: 33, event1: 1, event2: 2, type: "collaboration"}];
    for (var k in expected) {
        var found = false;
        for (var j in patched.interactions){
            if (JSON.stringify(patched.interactions[j]) == JSON.stringify(expected[k])) {
                found = true;
                break;
            }
        }
        if (!found){
            errors.push("Collaboration (with id " + expected[k].id + ") from " + expected[k].event1 + "->"+ expected[k].event2 + " expected but not found in patched result");
        }
    }

    console.log("------ INTERACTIONS TEST: each adds same collaboration between same pair of events separately, one from 1->3 and other from 3->1 ------");
    console.log(errors.length == 0 ? "PASS" : "FAIL");
    for (var k in errors) {
        console.log(errors[k]);
    }
    console.log("------------------------------------------------------------");
    return errors.length == 0;
};

// Each separately added the same handoff between same pair of events
// i.e. both will have added same 1->2
// Our algorithm should choose the one with smaller id in this case
// Events are unchanged
var test_NewHandoffs_SameEventPair = function(){
    var errors = [];
    var ancestor = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 10, startHr: "2", startMin: 0, duration: 45}]};
    var master = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 10, startHr: "2", startMin: 0, duration: 45}], "interactions":[{id: 5, event1: 1, event2: 2, type: "handoff"}]};
    var branch = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 10, startHr: "2", startMin: 0, duration: 45}], "interactions":[{id: 7, event1: 1, event2: 2, type: "handoff"}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length > 0){
        errors.push("Expected no conflicts, but got some: " + JSON.stringify(diffed.conflicts));
    }

    var patched = xdiff.patchTeam(diffed.diffs, ancestor);
    if(patched.interactions.length != 1){
        errors.push("Expected 1 handoff, actual: " + patched.interactions.length);
    }

    var expected = [{id: 5, event1: 1, event2: 2, type: "handoff"}];
    for (var k in expected) {
        var found = false;
        for (var j in patched.interactions){
            if (JSON.stringify(patched.interactions[j]) == JSON.stringify(expected[k])) {
                found = true;
                break;
            }
        }
        if (!found){
            errors.push("Handoff (with id " + expected[k].id + ") from " + expected[k].event1 + "->"+ expected[k].event2 + " expected but not found in patched result");
        }
    }

    console.log("------ INTERACTIONS TEST: each adds new handoff between same pair of events separately, both from 1->2 ------");
    console.log(errors.length == 0 ? "PASS" : "FAIL");
    for (var k in errors) {
        console.log(errors[k]);
    }
    console.log("------------------------------------------------------------");
    return errors.length == 0;
};

// Each separately added new collaboration between different pairs of events
// i.e. one added 1->3 and other added 1->5 OR one added 1->3 and other added 2->5
// Events are unchanged

// PROBLEM: returns an event object in the newly added patched result for the "interactions" array
var test_NewCollaborations_DifferentEventPairs = function(){
    var errors = [];
    var ancestor = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 10, startHr: "1", startMin: 15, duration: 45}, {id: 3, y: 15, startHr: "1", startMin: 30, duration: 45}]};
    var master = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 10, startHr: "1", startMin: 15, duration: 45}, {id: 3, y: 15, startHr: "1", startMin: 30, duration: 45}], "interactions":[{id: 11, event1: 2, event2: 3, type: "collaboration"}]};
    var branch = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 10, startHr: "1", startMin: 15, duration: 45}, {id: 3, y: 15, startHr: "1", startMin: 30, duration: 45}], "interactions":[{id: 22, event1: 2, event2: 1, type: "collaboration"}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length > 0){
        errors.push("Expected no conflicts, but got some: " + JSON.stringify(diffed.conflicts));
    }

    var patched = xdiff.patchTeam(diffed.diffs, ancestor);
    if(patched.interactions.length != 2){
        errors.push("Expected 2 collaborations, actual: " + patched.interactions.length);
    }

    var expected = [{id: 11, event1: 2, event2: 3, type: "collaboration"}, {id: 22, event1: 2, event2: 1, type: "collaboration"}];
    for (var k in expected) {
        var found = false;
        for (var j in patched.interactions){
            if (JSON.stringify(patched.interactions[j]) == JSON.stringify(expected[k])) {
                found = true;
                break;
            }
        }
        if (!found){
            errors.push("Collaboration (with id " + expected[k].id + ") from " + expected[k].event1 + "->"+ expected[k].event2 + " expected but not found in patched result");
        }
    }

    console.log("------ INTERACTIONS TEST: each adds new collaboration between different pair of events separately, one from 2->3 and other from 2->1 ------");
    console.log(errors.length == 0 ? "PASS" : "FAIL");
    for (var k in errors) {
        console.log(errors[k]);
    }
    console.log("------------------------------------------------------------");
    return errors.length == 0;
};

// Each separately added new handoff between different pairs of events
// i.e. one added 1->3 and other added 1->5 OR one added 1->3 and other added 2->5
// Events are unchanged

// SAME PROBLEM AS ABOVE: returns an event object in the newly added patched result for the "interactions" array
var test_NewHandoffs_DifferentEventPairs = function(){
    var errors = [];
    var ancestor = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "3", startMin: 0, duration: 45}, {id: 3, y: 5, startHr: "5", startMin: 0, duration: 45}]};
    var master = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "3", startMin: 0, duration: 45}, {id: 3, y: 5, startHr: "5", startMin: 0, duration: 45}], "interactions":[{id: 11, event1: 1, event2: 2, type: "handoff"}]};
    var branch = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "3", startMin: 0, duration: 45}, {id: 3, y: 5, startHr: "5", startMin: 0, duration: 45}], "interactions":[{id: 22, event1: 2, event2: 3, type: "handoff"}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length > 0){
        errors.push("Expected no conflicts, but got some: " + JSON.stringify(diffed.conflicts));
    }

    var patched = xdiff.patchTeam(diffed.diffs, ancestor);
    if(patched.interactions.length != 2){
        errors.push("Expected 2 handoffs, actual: " + patched.interactions.length);
    }

    var expected = [{id: 11, event1: 1, event2: 2, type: "handoff"}, {id: 22, event1: 2, event2: 3, type: "handoff"}];
    for (var k in expected) {
        var found = false;
        for (var j in patched.interactions){
            if (JSON.stringify(patched.interactions[j]) == JSON.stringify(expected[k])) {
                found = true;
                break;
            }
        }
        if (!found){
            errors.push("Handoff (with id " + expected[k].id + ") from " + expected[k].event1 + "->"+ expected[k].event2 + " expected but not found in patched result");
        }
    }

    console.log("------ INTERACTIONS TEST: each adds new handoff between different pair of events separately, one from 1->2 and other from 2->3 ------");
    console.log(errors.length == 0 ? "PASS" : "FAIL");
    for (var k in errors) {
        console.log(errors[k]);
    }
    console.log(patched);
    console.log("------------------------------------------------------------");
    return errors.length == 0;
};

// One added handoff and other added collaboration
// between SAME pair of events
// i.e. one added handoff from 1->2 and other added collaboration from 1->2
// Events are unchanged
var test_NewHandoff_NewCollaboration_SameEventPair = function(){
    var errors = [];
    var ancestor = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "3", startMin: 0, duration: 45}]};
    var master = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "3", startMin: 0, duration: 45}], "interactions":[{id: 11, event1: 1, event2: 2, type: "handoff"}]};
    var branch = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "3", startMin: 0, duration: 45}], "interactions":[{id: 22, event1: 1, event2: 2, type: "collaboration"}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length == 0){
        errors.push("Expected 1 conflict, but got none");
    } else if (diffed.conflicts[0].type != INTERACTIONS_DIFF_TYPE_SAME_EVENTS) {
        errors.push("Expected \"" + INTERACTIONS_DIFF_TYPE_SAME_EVENTS + "\" but got " + diffed.conflicts[0].type);
    }

    console.log("------ INTERACTIONS TEST: one adds new handoff and other adds new collaboration between same pair of events ------");
    console.log(errors.length == 0 ? "PASS" : "FAIL");
    for (var k in errors) {
        console.log(errors[k]);
    }
    console.log("------------------------------------------------------------");
    return errors.length == 0;
};

// One added handoff and other added collaboration
// between DIFFERENT pair of events
// i.e. one added handoff from 1->2 and other added collaboration from 3->4
// Events are unchanged

// SAME PROBLEM AS ABOVE: returns an event object in the newly added patched result for the "interactions" array
var test_NewHandoff_NewCollaboration_DifferentEventPair = function(){
    var errors = [];
    var ancestor = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "4", startMin: 0, duration: 45}, {id: 3, y: 10, startHr: "4", startMin: 30, duration: 45}]};
    var master = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "4", startMin: 0, duration: 45}, {id: 3, y: 10, startHr: "4", startMin: 30, duration: 45}], "interactions":[{id: 11, event1: 1, event2: 2, type: "handoff"}]};
    var branch = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "4", startMin: 0, duration: 45}, {id: 3, y: 10, startHr: "4", startMin: 30, duration: 45}], "interactions":[{id: 22, event1: 2, event2: 3, type: "collaboration"}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length > 0){
        errors.push("Expected no conflicts, but got some: " + JSON.stringify(diffed.conflicts));
    }

    var patched = xdiff.patchTeam(diffed.diffs, ancestor);
    if(patched.interactions.length != 2){
        errors.push("Expected 2 handoffs, actual: " + patched.interactions.length);
    }

    var expected = [{id: 11, event1: 1, event2: 2, type: "handoff"}, {id: 22, event1: 2, event2: 3, type: "collaboration"}];
    for (var k in expected) {
        var found = false;
        for (var j in patched.interactions){
            if (JSON.stringify(patched.interactions[j]) == JSON.stringify(expected[k])) {
                found = true;
                break;
            }
        }
        if (!found){
            errors.push("Interaction (with id " + expected[k].id + ") from " + expected[k].event1 + "->"+ expected[k].event2 + " expected but not found in patched result");
        }
    }

    console.log("------ INTERACTIONS TEST: one adds new handoff and other adds new collaboration between DIFFERENT pair of events ------");
    console.log(errors.length == 0 ? "PASS" : "FAIL");
    for (var k in errors) {
        console.log(errors[k]);
    }
    console.log(patched);
    console.log("------------------------------------------------------------");
    return errors.length == 0;
};

// One adds handoff and other flips x location of the two events
var test_NewHandoff_EventShifted = function(){
    var errors = [];
    var ancestor = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "2", startMin: 0, duration: 45}]};
    var master = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "2", startMin: 0, duration: 45}], "interactions":[{id: 11, event1: 1, event2: 2, type: "handoff"}]};
    var branch = {"events":[{id: 1, y: 5, startHr: "2", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "1", startMin: 0, duration: 45}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length == 0){
        errors.push("Expected 1 conflict but got none");
    } else if (diffed.conflicts[0].type != HANDOFF_MISORDERED_EVENTS_CONFLICT) {
        errors.push("Expected \"" + HANDOFF_MISORDERED_EVENTS_CONFLICT + "\" but got " + diffed.conflicts[0].type);
    }

    console.log("------ INTERACTIONS TEST: one adds new handoff and other flips x location of the two events ------");
    console.log(errors.length == 0 ? "PASS" : "FAIL");
    for (var k in errors) {
        console.log(errors[k]);
    }
    console.log("------------------------------------------------------------");
    return errors.length == 0;
};

// One adds collaboration and other separates the two events so that they have no more x overlap
var test_NewCollaboration_EventSeparated = function(){
    var errors = [];
    var ancestor = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 10, startHr: "1", startMin: 30, duration: 45}]};
    var master = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 10, startHr: "1", startMin: 30, duration: 45}], "interactions":[{id: 11, event1: 1, event2: 2, type: "collaboration"}]};
    var branch = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 10, startHr: "3", startMin: 0, duration: 45}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length == 0){
        errors.push("Expected 1 conflict but got none");
    } else if (diffed.conflicts[0].type != COLLABORATION_NO_OVERLAP_CONFLICT) {
        errors.push("Expected \"" + COLLABORATION_NO_OVERLAP_CONFLICT + "\" but got " + diffed.conflicts[0].type);
    }

    console.log("------ INTERACTIONS TEST: one adds new handoff and other separates the two events so that they have no more x overlap ------");
    console.log(errors.length == 0 ? "PASS" : "FAIL");
    for (var k in errors) {
        console.log(errors[k]);
    }
    console.log("------------------------------------------------------------");
    return errors.length == 0;
};

// One adds handoff and other deletes one of the two events involved
var test_NewHandoff_EventDeleted = function(){
    var errors = [];
    var ancestor = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "3", startMin: 0, duration: 45}]};
    var master = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "3", startMin: 0, duration: 45}], "interactions":[{id: 11, event1: 1, event2: 2, type: "handoff"}]};
    var branch = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length == 0){
        errors.push("Expected 1 conflict but got none");
    } else if (diffed.conflicts[0].type != INTERACTION_MISSING_EVENT_CONFLICT) {
        errors.push("Expected \"" + INTERACTION_MISSING_EVENT_CONFLICT + "\" but got " + diffed.conflicts[0].type);
    }

    console.log("------ INTERACTIONS TEST: one adds new handoff and other deletes one of the two events involved ------");
    console.log(errors.length == 0 ? "PASS" : "FAIL");
    for (var k in errors) {
        console.log(errors[k]);
    }
    console.log("------------------------------------------------------------");
    return errors.length == 0;
};

// One adds collaboration and other deletes one of the two events involved
var test_NewCollaboration_EventDeleted = function(){
    var errors = [];
    var ancestor = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "1", startMin: 30, duration: 45}]};
    var master = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}, {id: 2, y: 5, startHr: "1", startMin: 30, duration: 45}], "interactions":[{id: 11, event1: 1, event2: 2, type: "collaboration"}]};
    var branch = {"events":[{id: 1, y: 5, startHr: "1", startMin: 0, duration: 45}]};

    var diffed = xdiff.diff3Teams(branch, ancestor, master);
    if(diffed.conflicts.length == 0){
        errors.push("Expected 1 conflict but got none");
    } else if (diffed.conflicts[0].type != INTERACTION_MISSING_EVENT_CONFLICT) {
        errors.push("Expected \"" + INTERACTION_MISSING_EVENT_CONFLICT + "\" but got " + diffed.conflicts[0].type);
    }

    console.log("------ INTERACTIONS TEST: one adds new handoff and other deletes one of the two events involved ------");
    console.log(errors.length == 0 ? "PASS" : "FAIL");
    for (var k in errors) {
        console.log(errors[k]);
    }
    console.log("------------------------------------------------------------");
    return errors.length == 0;
};

var tests = [
    // events
    test_EventsNotOverlap_DifferentY,
    test_EventsNotOverlap_SameY_OneWay,
    test_EventsNotOverlap_SameY_OtherWay,
    test_EventsOverlap,

    // members
    test_NewMember,
    
    // interactions
    test_NewCollaboration_SameEventPair,
    test_NewHandoffs_SameEventPair,
    test_NewCollaborations_DifferentEventPairs,
    test_NewHandoffs_DifferentEventPairs,
    test_NewHandoff_NewCollaboration_SameEventPair,
    test_NewHandoff_NewCollaboration_DifferentEventPair,
    
    // interactions with simultaneous event changes
    test_NewHandoff_EventShifted,
    test_NewCollaboration_EventSeparated,
    test_NewHandoff_EventDeleted,
    test_NewCollaboration_EventDeleted
];

function runAll() {
    var failed = [];
    for (var t in tests) {
        if(!tests[t]()) {
            failed.push(t);
        }
    }
    if(failed.length == 0) {
        console.log("~~~~~~~~~~~~~ ALL TESTS PASSED ~~~~~~~~~~~~~~~~~");
    } else {
        console.log("~~~~~~~~~~~~~ " + failed.length + " TEST FAILURES ~~~~~~~~~~~~~~~~~");
        console.log(JSON.stringify(failed));
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    }
}

//runAll();

// --

/*
var ancestor = {a: 5};
var latest = {a: 6};
var branch = {a: 7};
*/

/*
var ancestor = {"events":[{id: 345345, "x":127}, {id: 345346, "x":130}]};
var master = {"events":[{id: 345345, "x":127}, {id: 345346, "x":130}]};
var branch = {"events":[{id: 345345, "x":127}]};

var diffed = xdiff.diff3(branch, ancestor, master);
console.log("merged:");
console.log(JSON.stringify(diffed));

var patched = xdiff.patch(master, diffed);
console.log(patched);
*/

/*
var ancestor = {"events":[{id: 345345, "x":127}, {id: 345346, "x":130}, {id: 347, "x":130}, {id: 346, "x":130}, {id: 345, "x":130}]};
// should be splice with two things in the 2nd index
var branchA = {"events":[{id: 345345, "x":127}, {id: 345349, "x":160}, {id: 347, "x":130}, {id: 350, "x":130}, {id: 345, "x":130}]};
// should be splice [1,1]
var branchB = {"events":[{id: 345345, "x":127}]};
// should be splice [1,1] and set x to 500
var branchC = {"events":[{id: 345345, "x":500}]};
// should be splice [0,2, ref of first object, ref of second object]
var branchD = {"events":[{id: 345347, "x":500}, {id: 3453410, "x":501}]};
// should be set only, no splice
var branchE = {"events":[{id: 345345, "x":127}, {id: 345346, "x":139}]};

console.log(JSON.stringify(xdiff.diff(ancestor, branchA)));
console.log(JSON.stringify(xdiff.diff(ancestor, branchB)));
console.log(JSON.stringify(xdiff.diff(ancestor, branchC)));
console.log(JSON.stringify(xdiff.diff(ancestor, branchD)));
console.log(JSON.stringify(xdiff.diff(ancestor, branchE)));
*/

/*
var ancestor = {"events":[{id: 1, x: 5, width: 5}]};
var master = {"events":[{id: 1, x: 5, width: 5}, {id: 2, x: 31, width: 5}]};
var branch = {"events":[{id: 1, x: 5, width: 5}, {id: 3, x: 21, width: 5}]};

var diffed = xdiff.diff3(branch, ancestor, master);
console.log("merged:");
console.log(JSON.stringify(diffed));
*/

/*
var patchedBranch = xdiff.patch(branch, diffed);
console.log("patched branch:");
console.log(JSON.stringify(patchedBranch));

var patchedMaster = xdiff.patch(master, diffed);
console.log("patched master:");
console.log(JSON.stringify(patchedMaster));
*/


//xdiff.diff(ancestor, latest);

//var patched = xdiff.patch(branch, diffed);
//console.log(patched);
/*
var a0 = [{__id__:'#1', b:6, c:8}, 6];
var a1 = [{__id__:'#1', b:6, c:8}, {d:7, e:{__id__:'#2'}}];
var p = xdiff.diff(a0, a1)
console.log("a: " + JSON.stringify(a0));
console.log("b: " + JSON.stringify(a1));
console.log("diff: " + JSON.stringify(p));

var patched = xdiff.patch(a0, p);
//console.log(patched);
*/

// TEST A: 2 events, just move the second one to the right a little
// NO CONFLICT EXPECTED
(function(){
    var ancestor = {"title":"testteam35","id":154,"events":[{"id":1482452261767,"x":84,"min_x":88,"y":5,"timer":75,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"New Event","members":[],"startTime":60,"duration":75,"startHr":1,"startMin":0,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1482452263565,"x":304,"min_x":308,"y":5,"timer":135,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"New Event","members":[],"startTime":210,"duration":135,"startHr":3,"startMin":30,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}}],"members":[],"folders":[],"interactions":[],"author":"jaypatel","status":false};
    var branch = {"title":"testteam35 Branch","id":155,"events":[{"id":1482452261767,"x":84,"min_x":88,"y":5,"timer":75,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"New Event","members":[],"startTime":60,"duration":75,"startHr":1,"startMin":0,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1482452263565,"x":590,"min_x":590,"y":5,"timer":135,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"New Event","members":[],"startTime":405,"duration":135,"startHr":6,"startMin":45,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}}],"members":[],"folders":[],"interactions":[],"author":"jaypatel","status":false,"team_type":"branch","pr_id":"46","parent_team_id":154,"local_update":1482452308607};
    var master = {"title":"testteam35","id":154,"events":[{"id":1482452261767,"x":84,"min_x":88,"y":5,"timer":75,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"New Event","members":[],"startTime":60,"duration":75,"startHr":1,"startMin":0,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1482452263565,"x":304,"min_x":308,"y":5,"timer":135,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"New Event","members":[],"startTime":210,"duration":135,"startHr":3,"startMin":30,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}}],"members":[],"folders":[],"interactions":[],"author":"jaypatel","status":false};

    var results = xdiff.diff3Teams(branch, ancestor, master);
    if(results.conflicts.length > 0) {
        console.log("CONFLICTS:");
        console.log(results.conflicts);
    }

    var patched = xdiff.patchTeam(results.diffs, branch); // pull from master
    console.log("patched:");
    console.log(patched);
});

// TEST B: 2 events, where one is moved in the branch and the same one
// is moved elsewhere in the master
// EXPECTED CONFLICT
(function(){
    var ancestor = {"title":"testteam36","id":156,"events":[{"id":1482452433939,"x":150,"min_x":154,"y":5,"timer":75,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":null,"title":"New Event","members":[],"startTime":105,"duration":75,"startHr":1,"startMin":45,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1482452435210,"x":436,"min_x":440,"y":5,"timer":210,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":null,"title":"New Event","members":[],"startTime":300,"duration":210,"startHr":5,"startMin":0,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}}],"members":[],"folders":[],"interactions":[],"author":"jaypatel","status":false,"startTime":1482452438695};
    var branch = {"title":"testteam36 Branch","id":157,"events":[{"id":1482452433939,"x":150,"min_x":154,"y":5,"timer":75,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":null,"title":"New Event","members":[],"startTime":105,"duration":75,"startHr":1,"startMin":45,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1482452435210,"x":304,"min_x":304,"y":5,"timer":210,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":null,"title":"New Event","members":[],"startTime":210,"duration":210,"startHr":3,"startMin":30,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}}],"members":[],"folders":[],"interactions":[],"author":"jaypatel","status":false,"startTime":1482452438695,"team_type":"branch","pr_id":"47","parent_team_id":156,"local_update":1482452468549};
    var master = {"title":"testteam36","id":156,"events":[{"id":1482452433939,"x":150,"min_x":154,"y":5,"timer":75,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":null,"title":"New Event","members":[],"startTime":105,"duration":75,"startHr":1,"startMin":45,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1482452435210,"x":1008,"min_x":1008,"y":5,"timer":210,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":null,"title":"New Event","members":[],"startTime":690,"duration":210,"startHr":11,"startMin":30,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}}],"members":[],"folders":[],"interactions":[],"author":"jaypatel","status":false,"startTime":1482452438695,"local_update":1482452495484};

    var results = xdiff.diff3Teams(branch, ancestor, master);
    if(results.conflicts.length > 0) {
        console.log("CONFLICTS:");
        console.log(results.conflicts);
    }

    var patched = xdiff.patchTeam(results.diffs, branch); // pull from master
    console.log("patched:");
    console.log(patched);
});

// TEST C: 2 events, where one is deleted in the branch and the same one is
// moved in the master
// EXPECTED CONFLICT
(function(){
    var ancestor = {"title":"testteam37","id":158,"events":[{"id":1482452839517,"x":128,"min_x":132,"y":5,"timer":105,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"New Event","members":[],"startTime":90,"duration":105,"startHr":1,"startMin":30,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1482452840493,"x":370,"min_x":374,"y":5,"timer":135,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"New Event","members":[],"startTime":255,"duration":135,"startHr":4,"startMin":15,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}}],"members":[],"folders":[],"interactions":[],"author":"jaypatel","status":false};
    var branch = {"title":"testteam37 Branch","id":159,"events":[{"id":1482452839517,"x":128,"min_x":132,"y":5,"timer":105,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"New Event","members":[],"startTime":90,"duration":105,"startHr":1,"startMin":30,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}}],"members":[],"folders":[],"interactions":[],"author":"jaypatel","status":false,"team_type":"branch","pr_id":"48","parent_team_id":158};
    var master = {"title":"testteam37","id":158,"events":[{"id":1482452839517,"x":128,"min_x":132,"y":5,"timer":105,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":null,"title":"New Event","members":[],"startTime":90,"duration":105,"startHr":1,"startMin":30,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1482452840493,"x":1074,"min_x":1074,"y":5,"timer":135,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":null,"title":"New Event","members":[],"startTime":735,"duration":135,"startHr":12,"startMin":15,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}}],"members":[],"folders":[],"interactions":[],"author":"jaypatel","status":false,"startTime":1482452856997,"local_update":1482452923561};

    var results = xdiff.diff3Teams(branch, ancestor, master);
    if(results.conflicts.length > 0) {
        console.log("CONFLICTS:");
        console.log(results.conflicts);
    }

    var patched = xdiff.patchTeam(results.diffs, branch); // pull from master
    console.log("patched:");
    console.log(patched);
});

// TEST D: adding a new event in master and branch separately, around 
// the same location on the timeline
(function(){
    var ancestor = {"title":"testteam38","id":160,"events":[{"id":1482453024658,"x":128,"min_x":132,"y":5,"timer":105,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"New Event","members":[],"startTime":90,"duration":105,"startHr":1,"startMin":30,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1482453025936,"x":480,"min_x":484,"y":5,"timer":345,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"New Event","members":[],"startTime":330,"duration":345,"startHr":5,"startMin":30,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}}],"members":[],"folders":[],"interactions":[],"author":"jaypatel","status":false};
    var branch = {"title":"testteam38 Branch","id":161,"events":[{"id":1482453024658,"x":128,"min_x":132,"y":5,"timer":105,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"New Event","members":[],"startTime":90,"duration":105,"startHr":1,"startMin":30,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1482453025936,"x":480,"min_x":484,"y":5,"timer":345,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"New Event","members":[],"startTime":330,"duration":345,"startHr":5,"startMin":30,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1482453052743,"x":238,"min_x":242,"y":85,"timer":90,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"New Event","members":[],"startTime":165,"duration":90,"startHr":2,"startMin":45,"row":1,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}}],"members":[],"folders":[],"interactions":[],"author":"jaypatel","status":false,"team_type":"branch","pr_id":"49","parent_team_id":160};
    var master = {"title":"testteam38","id":160,"events":[{"id":1482453024658,"x":128,"min_x":132,"y":5,"timer":105,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":null,"title":"New Event","members":[],"startTime":90,"duration":105,"startHr":1,"startMin":30,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1482453025936,"x":480,"min_x":484,"y":5,"timer":345,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":null,"title":"New Event","members":[],"startTime":330,"duration":345,"startHr":5,"startMin":30,"row":0,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1482453096856,"x":282,"min_x":282,"y":85,"timer":90,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"blahblah event","members":[],"startTime":195,"duration":90,"startHr":3,"startMin":15,"row":1,"dri":"","pc":"","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}}],"members":[],"folders":[],"interactions":[],"author":"jaypatel","status":false,"startTime":1482453040472,"local_update":1482453114264};

    var results = xdiff.diff3Teams(branch, ancestor, master);
    if(results.conflicts.length > 0) {
        console.log("CONFLICTS:");
        console.log(results.conflicts);
    }

    var patched = xdiff.patchTeam(results.diffs, branch); // pull from master
    console.log("patched:");
    console.log(patched);
});
