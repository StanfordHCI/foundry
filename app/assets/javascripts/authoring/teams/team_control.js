TeamControl = {
  //var startTeam = function(firstTime){
  // user must call this startTeam(true, )
  start: function(firstTime) {
    if(!this.in_progress) {
        this.updateOriginalStatus();
        recordStartTime();
        createProjectFolder();
        this.in_progress = true; // TODO: set before this?
        $("#projectStatusText").html("The project is in progress.<br /><br />");

        this.flash_teams_json["paused"]=false;
        updateInteractionsPopovers();

        this.logActivity("var startTeam = function(firstTime) - Before Update Status",'Start Team - Before Update Status', this.flash_teams_json);

        //added next line to disable the ticker
        this.updateStatus(true);

        logActivity("var startTeam = function(firstTime) - After Update Status",'Start Team - After Update Status', this.flash_teams_json);
    }

    // page was loaded after team started
    // OR
    // page was loaded before team started && this call to startTeam is as a result of
    // team now starting (received through poll)

    var page_loaded_after_start = firstTime && in_progress;
    var page_loaded_before_start_and_now_started = user_loaded_before_team_start && in_progress;

    if(page_loaded_after_start || page_loaded_before_start_and_now_started){
        if(page_loaded_before_start_and_now_started)
            user_loaded_before_team_start = false;
    }
  },

  //function endTeam()
  end: function() {
    //console.log("TEAM ENDED");
    $('#confirmAction').modal('hide');
    this.logActivity("endTeam()",'End Team', this.flash_teams_json);
    this.updateStatus(false);
    stopCursor();
    stopProjectStatus();
    stopTrackingTasks();
    $("#flashTeamEndBtn").attr("disabled", "disabled");
    $("#flashTeamPauseBtn").css('display','none');
    $("#projectStatusText").html("The project is not in progress or has not started yet.");
    $("#projectStatusText").toggleClass('projectStatusText-inactive', false);
  }

}
