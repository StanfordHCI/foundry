var author_name; // save name of flash team author
var team_name; // saves flash team name
var team_id; // saves flash team id

//returns author name, team name and team ID
$.fn.getTeamInfo = function(){
    var flash_team_id = $(this).val();
    var url = '/flash_teams/' + flash_team_id + '/get_team_info';
    $.ajax({
       url: url,
       type: 'post'
    }).done(function(data){
        saveFlashTeam(data)
    });
};

var saveFlashTeam = function(data){
    flashTeamsJSON["author"] = author_name = data["author_name"];
    flashTeamsJSON["title"] = team_name = data["flash_team_name"];
    flashTeamsJSON["id"] = team_id =   data["flash_team_id"];
};

$.fn.requestUpdates = function(firstTime) {
    var flash_team_id = $(this).val();
    var url = '/flash_teams/' + flash_team_id + '/get_status';
    $.ajax({
        url: url,
        type: 'get'
    }).done(function(data){
        if(data == null) return;
        loadedStatus = data;

        if(flashTeamEndedorStarted() || flashTeamUpdated()) {
            renderEverything(loadedStatus, firstTime);
        } else {
            drawStartedEvents();
        }
  });
};

var update_task_status = function(event_id, task_action) {
    switch(task_action) {
        case task_actions.START:
            live_tasks.push(event_id);
            break;
        case task_actions.PAUSE:
            paused_tasks.push(event_id);
            break;
        case task_actions.RESUME:
            var idx = paused_tasks.indexOf(event_id);
            if (idx != -1) {
                paused_tasks.splice(idx, 1);
            }
            break;
        case task_actions.DELAY:
            var idx = live_tasks.indexOf(event_id);
            if (idx != -1) {
                var removed = live_tasks.splice(idx, 1); // take out of live_tasks
                if (removed.length > 0) {
                    delayed_tasks.push(event_id); // add to delayed_tasks
                }
            }
            break;
        case task_actions.COMPLETE:
            if (isLive(event_id)) {
                var idx = live_tasks.indexOf(event_id);
                if (idx != -1) {
                    var removed = live_tasks.splice(idx, 1);
                    if (removed.length > 0) {
                        drawn_blue_tasks.push(event_id);
                    }
                }
            } else if (isDelayed(event_id)) {
                var idx = delayed_tasks.indexOf(event_id);
                if (idx != -1) {
                    var removed = delayed_tasks.splice(idx, 1);
                    if (removed.length > 0) {
                        completed_red_tasks.push(event_id);
                    }
                }
            }
            break;
    }
};

$.fn.subscribeToEventUpdate = function() {
    url = "/flash_team/" + $(this).val() + "/updated_event";
    PrivatePub.subscribe(url, function(data, channel) {
        if (data) {
            if (!data.ev["members"]) {
                data.ev["members"] = [];
            }
            var found = false;
            for (var i = 0; i < flashTeamsJSON["events"].length; i++) {
                if (flashTeamsJSON["events"][i]["id"] == data.ev["id"]) {
                    flashTeamsJSON["events"][i] = data.ev;
                    found = true;
                }
            }
            if (!found) {
                flashTeamsJSON["events"].push(data.ev);
            }
            update_task_status(data.ev["id"], data.task_action);
            drawEvent(data.ev)
            initTimer();
        }
    });
}

$.fn.subscribeToFlashTeamUpdate = function() {
    url = "/flash_team/" + $(this).val() + "/updated";
    PrivatePub.subscribe(url, function(data, channel) {
        console.log("FLASH TEAM UPDATED");
        if (data) {
          console.log("RECEIVED FLASH TEAM UPDATE");
          console.log(data);
          renderEverything(data, false);
          drawStartedEvents();
        }
    });
}

$.fn.subscribeToFlashTeamInfo = function() {
    url = "/flash_team/" + $(this).val() + "/info";
    PrivatePub.subscribe(url, function(data, channel) {
        if (data) {
            saveFlashTeam(data);
        }
    });
}

$(document).ready(function(){
    //$("#flash_team_id").subscribeToEventUpdate();
    //$("#flash_team_id").subscribeToFlashTeamUpdate();
});
