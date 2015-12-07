var currentTeam = null;
var oldTeam = null;

FlashTeam = function (data) {
  this.extendWith(data);
  this.extendWith(Logger)
  this.extendWith(TeamControl)

  //renderEverything(loadedStatus, firstTime) analog
  this.render = function(firstTime) {
    if(this.rendered()) return;
    //console.log("Rendering...")
    this.renderJSON(firstTime);

    if(firstTime) {
        this.logActivity("renderEverything(firstTime)",'Render Everything - First Time', this.flash_teams_json);
        listenForVisibilityChange();
    }
  }

  this.rendered = function() {
    // Using transaction ID to avoid updatin client which is already updated.
    //console.log("global " + json_transaction_id)
    var currentTransactionID = oldTeam ? oldTeam.json_transaction_id : 0
    //console.log("current " + currentTransactionID)
    var givenTransactionID = this.json_transaction_id || 1
    //console.log("given " + givenTransactionID)
    // json_transaction_id = givenTransactionID
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
    window.entryManager = new window.EntryManager(this.flash_teams_json);

    //renderChatbox();
    setCurrentMember();
    projectOverview = new ProjectOverview(this)
    projectOverview.render();

    if(firstTime) {
        //setCurrentMember(); //commented this out because we now always call setCurrentMember() in case changes are made during project
        //!!!!!!!!!!!!!!!!!back later!!!!!!!!!!!!!!!!!!!!//
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
        if (firstTime && !this.inProgress())
            user_loaded_before_team_start = true;
    }


    colorBox();
    if(this.inProgress()){
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

        this.drawTasks();

        //!!!!!!!!!!! continue !!!!!!!!!!!!!!!!!!//
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
        if(this["startTime"] == undefined){

            //console.log("NO START TIME!");
            this.updateOriginalStatus();
        }

        this.drawTasks();

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

  //!!!!!!!!!!!!!!! continue !!!!!!!!!!!!!!!!!//
  // loadData
  this.drawTasks = function() {
      // position cursor before getting the new task arrays
      // because once the new task arrays are updated,
      // trackLiveAndRemainingTasks is immediately going to
      // operate on them, while the current cursor here is
      // not yet where it should be in time (its behind)
      var latest_time;
      if (this.inProgress()){
          latest_time = (new Date()).getTime();
      } else {
          latest_time = this.latest_time; // really only useful at end
      }

      live_tasks = loadedStatus.live_tasks;
      paused_tasks = loadedStatus.paused_tasks;
      remaining_tasks = loadedStatus.remaining_tasks;
      delayed_tasks = loadedStatus.delayed_tasks;

      drawEvents(!this.inProgress());

      // this.drawBoxes(this.drawn_blue_tasks , drawBlueBox);
      // this.drawBoxes(this.completed_red_tasks , drawRedBox);
      // this.drawBoxes(this.diffEvents(), drawOrangeBox);

      drawDelayedTasks();

      if(showDiff()) this.drawRemovedTasks();

      drawInteractions(); //START HERE, INT DEBUG
      googleDriveLink();
  };

  this.drawRemovedTasks = function() {
    if(this.diffEmpty()) return [];
    for(var i=0; i<this.getDiff().removed_events.length; i++){
      drawDeletedEvent(this.getDiff().removed_events[i])
    }
  }

  this.taskChanged = function(taskId) {
    if(this.diffEmpty()) return false;
    for(var i=0; i<this.diffEvents().length; i++){
      if(this.diffEvents()[i] == taskId) return true
    }
    return false;
  }

  this.taskDeleted = function(taskId) {
    if(this.diffEmpty()) return false;
    for(var i=0; i<this.getDiff().removed_events.length; i++){
      if(this.getDiff().removed_events[i].id == taskId) return true
    }
    return false;
  }

  this.diffEmpty = function() {
    return !this.flash_teams_json.diff
  }

  this.getDiff = function() {
    return this.flash_teams_json.diff
  }

  this.diffEvents = function() {
    if(this.diffEmpty()) { return [] }
    return this.getDiff().changed_events_ids.concat(this.getDiff().added_events_ids)
  }

  this.drawBoxes = function(collection, renderer) {
    for (var i=0;i<collection.length;i++){
        var ev = this.flash_teams_json["events"][getEventJSONIndex(collection[i])];
        var task_g = getTaskGFromGroupNum(collection[i]);

        renderer(ev, task_g);
    }

  }

  this.updateStatus = function(flash_team_in_progress) {
    //TODO Debug code. remove later
    var err = new Error();
    console.log("updateStatus");
    console.dir(err.stack);

    var self = this;
    self.json_transaction_id++;
    this.flash_teams_json.folders = window.entryManager.folders
    this.flash_teams_json.members = window.entryManager.members
    var localStatus = self.constructStatusObj();

    //if flashTeam hasn't been started yet, update the original status in the db
    if(flashTeamsJSON["startTime"] == undefined){
      self.updateOriginalStatus();
    }

    if(flash_team_in_progress != undefined){ // could be undefined if want to call updateStatus in a place where not sure if the team is running or not
        localStatus.flash_team_in_progress = flash_team_in_progress;
    }
    localStatus.latest_time = (new Date).getTime();
    var localStatusJSON = JSON.stringify(localStatus);
    //console.log("updating string: " + localStatusJSON);

    var flash_team_id = $("#flash_team_id").val();
    var authenticity_token = $("#authenticity_token").val();
    var url = '/flash_teams/' + flash_team_id + '/update_status';
    $.ajax({
        url: url,
        type: 'post',
        data: {"localStatusJSON": localStatusJSON, "authenticity_token": authenticity_token}
    }).done(function(data){
        //console.log("UPDATED FLASH TEAM STATUS");
    });
  }

  this.updateOriginalStatus = function() {
    //console.log("in updateOriginalStatus");
    var localStatus = this.constructStatusObj();

    localStatus.latest_time = (new Date).getTime();
    var localStatusJSON = JSON.stringify(localStatus);
    //console.log("updating string: " + localStatusJSON);

    var flash_team_id = $("#flash_team_id").val();
    var authenticity_token = $("#authenticity_token").val();
    var url = '/flash_teams/' + flash_team_id + '/update_original_status';
    $.ajax({
        url: url,
        type: 'post',
        data: {"localStatusJSON": localStatusJSON, "authenticity_token": authenticity_token}
    }).done(function(data){
        //console.log("UPDATED FLASH TEAM STATUS");
    });
  }

  this.constructStatusObj = function() {
    var flashTeamsJSON = this.flash_teams_json
    flashTeamsJSON["id"] = this.id; //previously: = $("#flash_team_id").val();
    flashTeamsJSON["title"] = this.name; //previously: = document.getElementById("ft-name").innerHTML;
    flashTeamsJSON["author"] = this.author;
    flashTeamsJSON["status"] = this.flash_team_in_progress;

    var localStatus = {};

    localStatus.json_transaction_id = this.json_transaction_id || 1;

    localStatus.local_update = flashTeamsJSON["local_update"];
    localStatus.team_paused = flashTeamsJSON["paused"];
    localStatus.task_groups = this.task_groups;
    localStatus.live_tasks = this.live_tasks;
    localStatus.paused_tasks = this.paused_tasks;
    localStatus.remaining_tasks = this.remaining_tasks;
    localStatus.delayed_tasks = this.delayed_tasks;
    localStatus.drawn_blue_tasks = this.drawn_blue_tasks;
    localStatus.completed_red_tasks = this.completed_red_tasks;
    localStatus.flash_teams_json = flashTeamsJSON;
    localStatus.flash_team_in_progress = this.flash_team_in_progress

    //delayed_task_time is required for sending notification emails on delay
    localStatus.delayed_tasks_time = delayed_tasks_time;
    localStatus.dri_responded = dri_responded;

    return localStatus;
  };
}

extend(FlashTeam, Wrapper)

updateStatus = function(flash_team_in_progress) {
  if (currentTeam.timer) {
      clearTimeout(currentTeam.timer); //cancel the previous timer.
      currentTeam.timer = null;
  }
  currentTeam.timer = setTimeout(function(){
    currentTeam.updateStatus(flash_team_in_progress)
  }, 1000)
}
