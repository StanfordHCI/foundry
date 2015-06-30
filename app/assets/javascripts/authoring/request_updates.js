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

$(document).ready(function(){
    $("#flash_team_id").subscribeToFlashTeamUpdate();
});
