var currentTeam = null;
var oldTeam = null;

FlashTeam = function () {
  //renderEverything(loadedStatus, firstTime) analog
  this.render = function(firstTime) {
    if(this.rendered?) return;
    //console.log("Rendering...")
    renderJSON(firstTime);

    if(firstTime) {
        logActivity("renderEverything(firstTime)",'Render Everything - First Time', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
        listenForVisibilityChange();
    }
  }

  this.rendered? = function() {
    // Using transaction ID to avoid updatin client which is already updated.
    //console.log("global " + json_transaction_id)
    var currentTransactionID = json_transaction_id || 0
    //console.log("current " + currentTransactionID)
    var givenTransactionID = data.json_transaction_id || 1
    //console.log("given " + givenTransactionID)
    json_transaction_id = givenTransactionID
    return (currentTransactionID >= givenTransactionID);
  }

  this.renderChatbox = function() {
    var chat = Chat.create(this.flash_teams_json)
    chat.render()
  }

//renderFlashTeamsJSON(data, firstTime) analog
  this.renderJSON = function(firstTime) {
    // firstTime will also be true in the case that flashTeamEndedorStarted, so
    // we make sure that it is false (i.e. true firstTime, upon page reload for user
    // before the team starts)
    // !user_poll means a poll wasn't the one the generated this call to renderEverything
    //if(firstTime && !user_poll) // TODO: find better way to capture the case of user_poll
    if(firstTime){
        this.renderChatbox();
    }

    in_progress = this.flash_team_in_progress;
    flashTeamsJSON = this.flash_teams_json;

    // initialize the entry manager after flashTeamsJSON has been loaded
    window.entryManager = new window.EntryManager(flashTeamsJSON);

    //renderChatbox();
    setCurrentMember();
    projectOverview = ProjectOverview.new(this)
    projectOverview.render();

    if(firstTime) {
        //setCurrentMember(); //commented this out because we now always call setCurrentMember() in case changes are made during project
        //!!!!!!!!!!!!!!!!!continue!!!!!!!!!!!!!!!!!!!!//
        initializeTimelineDuration();
        //renderProjectOverview(); //commented this out because we now always call setCurrentMember() in case changes are made during project
    }


    // is this the user, and has he/she loaded the page
    // before the team started
    // is_user && firstTime && in_progress would be the case
    // where the user loads the page for the first time after
    // the team has started
    if(isUser) {
        // user loaded page before team started
        if (firstTime && !in_progress)
            user_loaded_before_team_start = true;
    }


    colorBox();
    if(in_progress){
        //console.log("flash team in progress");
        $("#flashTeamStartBtn").attr("disabled", "disabled");
        $("#flashTeamStartBtn").css('display','none'); //not sure if this is necessary since it's above
        $("#flashTeamEndBtn").css('display',''); //not sure if this is necessary since it's above
        $("#workerEditTeamBtn").css('display','');

        if(flashTeamsJSON["paused"]){
            $("#flashTeamResumeBtn").css('display','');
            $("#flashTeamPauseBtn").css('display','none');
        }
        else{
            $("#flashTeamPauseBtn").css('display','');
            $("#flashTeamResumeBtn").css('display','none');
        }

        loadData();
        if(!isUser || memberType == "pc" || memberType == "client"){
            renderMembersRequester();
            $('#projectStatusText').html("The project is in progress.<br /><br />");
            $("#projectStatusText").toggleClass('projectStatusText-inactive', false);
        }else{
            renderAllMemberTabs();
            $("#projectStatusText").toggleClass('projectStatusText-inactive', true);
        }

        renderAllMemberTabs();
        trackUpcomingEvent();

        //call this function if team is not in the edit mode
        if(isUser && memberType != "pc" && memberType != "client"){
            disableTeamEditing();
        }
        else if(!flashTeamsJSON["paused"]){
            disableTeamEditing();
        }
    } else {
        //console.log("flash team not in progress");
        if(flashTeamsJSON["startTime"] == undefined){

            //console.log("NO START TIME!");
            updateOriginalStatus();
        }
        if(!flashTeamsJSON)
            return;

        loadData();

        if(isUser && memberType != "pc" && memberType != "client"){
            disableTeamEditing();
        }

        if(!isUser || memberType == "pc" || memberType == "client") {
            renderMembersRequester();
        }
    }
  }

  this.updateInfo = function(data) {
    this["author"] = data["author_name"];
    this["title"]  = data["flash_team_name"];
    this["id"]     = data["flash_team_id"];
  }
}

FlashTeam.create = function(parent) {
  var flashTeam = new FlashTeam();
  flashTeam.prototype = parent;
  return flashTeam;
}
