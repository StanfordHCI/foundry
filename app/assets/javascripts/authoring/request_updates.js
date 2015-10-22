//returns author name, team name and team ID
$.fn.getTeamInfo = function(){
    var flash_team_id = $(this).val();
    var url = '/flash_teams/' + flash_team_id + '/get_team_info';
    $.ajax({
       url: url,
       type: 'post'
    }).done(function(data){
        currentTeam.updateInfo(data);
    });
};

$.fn.requestUpdates = function(firstTime) {
    var flash_team_id = $(this).val();
    var url = '/flash_teams/' + flash_team_id + '/get_status';
    $.ajax({
        url: url,
        type: 'get'
    }).done(function(data){
        if(data == null || !data.flash_teams_json) return;
        loadedStatus = data;

        // if(flashTeamEndedorStarted() || flashTeamUpdated()) {
        // renderEverything(loadedStatus, firstTime);
        currentTeam = new FlashTeam(loadedStatus);
        currentTeam.render();
        // } else {
        //     drawStartedEvents();
        // }
  });

}

$.fn.subscribeToFlashTeamUpdate = function() {
    url = "/flash_team/" + $(this).val() + "/updated"
    PrivatePub.subscribe(url, function(data, channel) {
        if (data) {
            oldTeam = currentTeam;
            currentTeam = new FlashTeam(loadedStatus);
            currentTeam.render(false);
          // renderEverything(data, false);
          //console.log('subscribeToFlashTeamUpdate calling drawStartedEvents');
          // drawStartedEvents();
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

$(document).ready(function(){
    $("#flash_team_id").subscribeToFlashTeamUpdate();
    $("#flash_team_id").subscribeToFlashTeamInfo();
});
