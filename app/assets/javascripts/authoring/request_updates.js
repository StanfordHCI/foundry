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
}


$.fn.requestUpdates = function(firstTime) {
    var flash_team_id = $(this).val();
    var url = '/flash_teams/' + flash_team_id + '/get_status';
    $.ajax({
        url: url,
        type: 'get'
    }).done(function(data){
        if(data == null) return;
        loadedStatus = data;
        renderEverything(loadedStatus, firstTime);
        // if(flashTeamEndedorStarted() || flashTeamUpdated()) {
        //     renderEverything(loadedStatus, firstTime);
        // } else {
        //     drawStartedEvents();
        // }
  });

}

$.fn.subscribeToFlashTeamUpdate = function() {
    url = "/flash_team/" + $(this).val() + "/updated"
    PrivatePub.subscribe(url, function(data, channel) {
        if (data) {
          renderEverything(data, false);
          drawStartedEvents();
        }
    });
}

$.fn.subscribeToFlashTeamInfo = function() {
    url = "/flash_team/" + $(this).val() + "/info"
    PrivatePub.subscribe(url, function(data, channel) {
        if (data) {
            saveFlashTeam(data)
        }
    });
}

$.fn.subscribeToEventDeleted = function() {
    url = "/flash_team/" + $(this).val() + "/event_deleted"
    PrivatePub.subscribe(url, function(data, channel) {
        if (data) {
            deleteTask(data.id)
        }
    });
}

$.fn.subscribeToEventCreated = function() {
    url = "/flash_team/" + $(this).val() + "/event_created"
    PrivatePub.subscribe(url, function(data, channel) {
        if (data) {
            var eventObj = createEventObj(data);
            // render event on timeline
            drawEvent(eventObj, true);
        }
    });
}

$(document).ready(function(){
    $("#flash_team_id").subscribeToFlashTeamUpdate();
    $("#flash_team_id").subscribeToFlashTeamInfo();
});
