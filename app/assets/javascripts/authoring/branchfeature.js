var show_diff = false;

var review_mode = inReviewMode();

function inReviewMode(){
    var params = window.location.search.replace("?", "");

    if(params=="review=true"){
        return true;
    }
    else{
        return false;
    }
}


function showJSONModal(id_array){
    // loadOriginStatus(origin_id);
    // var origin_ft_json = loadedOriginStatus.flash_teams_json;

    if(show_diff == true && review_mode != true){
        hideTasksDiffs();
    }

    var url = '/flash_teams/' + origin_id.toString() + '/get_status';
    $.ajax({
        url: url,
        type: 'get'
    }).done(function(data){
        loadedOriginStatus = data;
        //console.log('loadedOriginStatus');
        //console.log("loadedStatusOriginJSON: " + loadedOriginStatus);
        var origin_ft_json = loadedOriginStatus.flash_teams_json;

    if(team_type == 'original'){
        $("#master-updated-json-div").css('display', 'none');
        $('#json-merge-footer-btn').css('display', 'none');
        $("#ancestor-json-div").css('display', 'none');
        $("#branch-json-div").removeClass( "span4" ).addClass( "span12" );
        $("#branch-json-div").html('<h3>CURRENT MASTER JSON</h3>' + JSON.stringify(flashTeamsJSON, null, 2));
     }

    if(team_type == 'branch'){
        if(memberType != 'author'){
            $("#json-merge-footer-btn").prop('disabled', true);
        }

        if(review_mode == true){
            $("#submit-pr").prop('disabled', true);
        }
        $("#master-updated-json-div").html('<h3>MASTER UPDATED JSON</h3>' + JSON.stringify(origin_ft_json, null, 2));
        $("#ancestor-json-div").html('<h3>ANCESTOR JSON</h3>' + JSON.stringify(ancestorBranch['flash_teams_json'], null, 2));
        $("#branch-json-div").html('<h3>BRANCH JSON</h3>' + JSON.stringify(flashTeamsJSON, null, 2));
    }

    $("#jsonModal").modal('show');

    });

}

function submitPullRequest(){
    var user = chat_name;
    var channel = "#foundry-notifications";  
    var notification_group = "@everyone";
    var private_slack_url = slackPrivateUrls['stanfordhcigfx'];

    var origin_team_name = ancestorBranch.flash_teams_json.title;

    var teamUrl = defaultUrl + '/flash_teams/'+flash_team_id+'/edit?review=true';
    var slackMsg = user + ' has submitted a pull request for the ' + origin_team_name + ' team on Foundry. <' + teamUrl + '|Review the pull request on Foundry.>';

    var payload = 'payload={\"channel\": \"' + channel + '\", \"username\": \"Foundry\", \"text\": \"' + slackMsg + '\", \"icon_emoji\": \":shipit:\", \"link_names\": 1}';
    $.post(private_slack_url, payload);
}

function mergeBranchToMaster(){

    // takes the current ancestorBranch, current master head,
    // and current branch head, and does the threeway merge
    var merged_json = diffMerge('branch-to-master');
    //var merged_json = diffMergeAll('branch-to-master');

    // current master's json
    // loadedOriginStatus is populated by loadOriginStatus()
    // in the call to diffMerge above
    var origin_ft_json = loadedOriginStatus;

    // this is where master's json is replaced with the merged one
    origin_ft_json['flash_teams_json'] = merged_json;

    var localStatusJSON = JSON.stringify(origin_ft_json);
        //console.log("updating string: " + localStatusJSON);

        // now save the new master branch data
        var flash_team_id = origin_id;
        var authenticity_token = $("#authenticity_token").val();
        var url = '/flash_teams/' + flash_team_id + '/update_status';
        $.ajax({
            url: url,
            type: 'post',
            data: {"localStatusJSON": localStatusJSON, "authenticity_token": authenticity_token}
        }).done(function(data){
            //console.log("UPDATED ORIGIN FLASH TEAM STATUS");

            // now that updated master in db, load a copy of it
            // locally so as to keep the local env in sync
            loadOriginStatus(origin_id);
            
        });

        //updateAncestorBranch(loadedOriginStatus);

        // retrieves the newly updated master branch (in db)
        // and saves it into the "original_status" field of the
        // current team so as to keep it in sync
        // pullMasterJSON calls loadOriginStatus again, heh
        pullMasterJSON();

        // now that the "original_status" field of the current
        // team is updated, go save the current team up in
        // the database
        updateStatus();

        //loadData();
        $("#jsonModal").modal('hide');

}

//replaces flashTeamsJSON with the JSON from the origin team
function mergeMasterToBranch(){
    var merged_json = diffMerge('master-to-branch');
    //var merged_json = diffMergeAll('master-to-branch');

    // overwrite local json
    flashTeamsJSON = merged_json;

    //updateStatus();

    //console.log('merged master to branch');

    // this should be unnecessary since the master branch wasn't
    // updated at all
    pullMasterJSON();

    // update the db with the new json of the current team
    updateStatus();

    // load back the data that was just updated in the db
    // this is mainly meant to retrieve the original_status field
    // which was updated by pullMasterJSON above
    // but should be unnecessaty if pullMasterJSON is taken out,
    // since the masteris not updated at all
    // to check: should we still store the master json into the
    // current team's original_status field anyway?
    loadData();
    //updateAncestorBranch(loadedOriginStatus);
    $("#jsonModal").modal('hide');
}



//replaces flashTeamsJSON with the JSON from the origin team
function forcePullMasterJSON(){
    loadOriginStatus(origin_id);

    var origin_ft_json = loadedOriginStatus;

    flashTeamsJSON = origin_ft_json['flash_teams_json'];

    updateStatus();

    //console.log('pulled master json');

    $("#jsonModal").modal('hide');
}

// updates "original status" saved in "ancestorBranch" var (e.g., the ancestor/local master) with the json from the origin team
function pullMasterJSON(){

    loadOriginStatus(origin_id);

    var origin_ft_json = loadedOriginStatus;

    var localStatusJSON = JSON.stringify(origin_ft_json);
        //console.log("updating string: " + localStatusJSON);

        var flash_team_id = $("#flash_team_id").val();
        var authenticity_token = $("#authenticity_token").val();
        var url = '/flash_teams/' + flash_team_id + '/update_original_status';
        $.ajax({
            url: url,
            type: 'post',
            data: {"localStatusJSON": localStatusJSON, "authenticity_token": authenticity_token}
        }).done(function(data){
            //console.log(data);
            //ancestorBranch = data['flash_teams_json']
            ancestorBranch = data;
            // console.log(JSON.stringify(ancestor_branch));
            //console.log("UPDATED LOCAL MASTER BRANCH IN pullMasterJSON");
        });

}

function diffMergeAll(merge_type){
    loadOriginStatus(origin_id);
    var master = ancestorBranch;
    
    var master_updated = loadedOriginStatus;
    var copied_master_updated = JSON.parse(JSON.stringify(master_updated));

    var branch = loadedStatus;
    var copied_branch = JSON.parse(JSON.stringify(branch));

    var diff = branchmerge.threeWayMerge(master_updated, master, branch);
    //console.log(JSON.stringify(diff, null, 3));
    
    if(merge_type == 'master-to-branch'){
        var merged = branchmerge.patch(diff.diff, master_updated, copied_branch);
        return merged;
    }

    if(merge_type == 'branch-to-master'){
        var merged = branchmerge.patch(diff.diff, master_updated, copied_master_updated);
        return merged;
    }
}

function diffMerge(merge_type){
    // ancestorBranch is kept up to date by calling pullMasterJSON
    var master = ancestorBranch.flash_teams_json;
    
    loadOriginStatus(origin_id); // get status of master
    var master_updated = loadedOriginStatus.flash_teams_json; // current master, at this point, when merging
    var copied_master_updated = JSON.parse(JSON.stringify(master_updated)); // current master stringified

    var branch = flashTeamsJSON; // current team
    var copied_branch = JSON.parse(JSON.stringify(branch)); // current team stringified

    //console.log(JSON.stringify(master_updated));
    var diff = branchmerge.threeWayMerge(master_updated, master, branch);
    //console.log(JSON.stringify(diff, null, 3));
    // var merged = branchmerge.patch(diff.diff, master_updated, branch);
    
    if(merge_type == 'master-to-branch'){
        var merged = branchmerge.patch(diff.diff, master_updated, copied_branch);
        return merged;
    }

    if(merge_type == 'branch-to-master'){
        var merged = branchmerge.patch(diff.diff, master_updated, copied_master_updated);
        return merged;
    }
}

function showDiff(){
    loadOriginStatus(origin_id);
    var master = ancestorBranch.flash_teams_json;
    var master_updated = loadedOriginStatus.flash_teams_json;
    var branch = flashTeamsJSON;

    //console.log(JSON.stringify(master_updated));
    //var diff = branchmerge.threeWayMerge(master_updated, master, branch);
    var diff = branchmerge.threeWayMerge(master, master_updated, branch);
    //console.log(JSON.stringify(diff, null, 3));

    return diff;
}


//var diffs_obj; 
var deleted_tasks = [];

function showTasksDiffs(){
    $('#JSONDiffBtn').attr('onclick', 'hideTasksDiffs()');
    $('#JSONDiffBtn').prop('value', 'Hide Diffs');

    // if(diffs_obj == undefined) {
    //  diffs_obj = testDiff();
    // }
    var diffs_obj = testDiff();

    for (var key in diffs_obj) {
        //console.log(key, diffs_obj[key]);
        showDiffTask(key, diffs_obj[key]['type'], diffs_obj[key]['index'])
    }

    show_diff = true;
}

function hideTasksDiffs(){
    $('#JSONDiffBtn').attr('onclick', 'showTasksDiffs()');
    $('#JSONDiffBtn').prop('value', 'Show Diffs');

    var diffs_obj = testDiff();

    for (var key in diffs_obj) {
        //console.log(key + ":" + diffs_obj[key]);
        hideDiffTask(key, diffs_obj[key]['type'], diffs_obj[key]['index'])
    }

    show_diff = false;
}

function testDiff(){

    var branch_events = getGroupNumArray(flashTeamsJSON['events']);

    var ancestor_events = getGroupNumArray(ancestorBranch.flash_teams_json['events']);

    var groupNumDiffs = {}; 

    for (var i=0;i<branch_events.length;i++){
        var arrayIndex = ancestor_events.indexOf(branch_events[i]);

        if(arrayIndex == -1){
            //console.log(ancestor_events.indexOf(branch_events[i]));
            groupNumDiffs[branch_events[i]] = {"type": "add", "index": i};
        }

        else{
            var branch_index = getIndexOfEventObj(branch_events[i], flashTeamsJSON['events']);
            var ancestor_index = getIndexOfEventObj(branch_events[i], ancestorBranch.flash_teams_json['events']);

            if(JSON.stringify(flashTeamsJSON['events'][branch_index]) != JSON.stringify(ancestorBranch.flash_teams_json['events'][ancestor_index])){
                groupNumDiffs[branch_events[branch_index]] = {"type": "edit", "index": i};
                //console.log('this event has been edited!');
            }


        }
    }

    for (var i=0;i<ancestor_events.length;i++){
        var arrayIndex = branch_events.indexOf(ancestor_events[i]);
        var groupNum = ancestor_events[i];

        if(arrayIndex == -1){
            //console.log(ancestor_events.indexOf(branch_events[i]));
            groupNumDiffs[ancestor_events[i]] = {"type": "del", "index": i};
            deleted_tasks.push(groupNum);
            deleted_tasks = jQuery.unique(deleted_tasks);
        }
        else{
            var indexOfJSON = getEventJSONIndex(groupNum);
            var eventObj = flashTeamsJSON["events"][indexOfJSON];
            if(eventObj.status == "deleted"){
                groupNumDiffs[ancestor_events[i]] = {"type": "del", "index": i};
                deleted_tasks.push(groupNum);
                deleted_tasks = jQuery.unique(deleted_tasks);
            }
        }
    }

    return groupNumDiffs;

}

function getGroupNumArray(events){

    var groupNumArray = []

    for (var i=0;i<events.length;i++){
        ev_id = events[i]['id'];
        groupNumArray.push(ev_id);
    }

    return groupNumArray;
}

//Access a particular "event" in the JSON by its id number and return its index in the JSON array of events
function getIndexOfEventObj(idNum, all_events_obj) {
    var num_events = all_events_obj.length;
    for (var i = 0; i < num_events; i++) {
        if (all_events_obj[i].id == idNum) {
            return i;
        }
    }
};

function showDiffTask(groupNum, type, index) {

    var groupNum = groupNum;
    
    if(type == "add" || type == "edit"){
        var indexOfJSON = getEventJSONIndex(groupNum);
        var eventObj = flashTeamsJSON["events"][indexOfJSON];

        var groupNum = eventObj["id"];
        var task_g = getTaskGFromGroupNum(groupNum);    
        var rect = task_g.selectAll("#rect_" + groupNum);
        var borderBottom = task_g.selectAll(".border-bottom");
    
        rect.attr("fill", TASK_SEL_COLOR);
        borderBottom.attr("fill", TASK_SEL_BORDER_COLOR);
    }

    if(type == "del"){
        var events = window._foundry.events;
        var indexOfJSON = index;
        var eventObj = ancestorBranch.flash_teams_json["events"][indexOfJSON];

        showTempEvent(eventObj);

        //console.log('groupNum: ' + groupNum);
    }
}

//Fires on show diff button
function hideDiffTask(groupNum, type, index) {

    if(type == "add" || type == "edit"){
        var indexOfJSON = getEventJSONIndex(groupNum);
        var eventObj = flashTeamsJSON["events"][indexOfJSON];
        drawEvent(eventObj); //Will update color
    }
    if(type == "del"){
        //console.log('calling hideDiffTask delete');
        //removeTask(groupNum);
        deleteEvent(groupNum)

        var index = deleted_tasks.indexOf(groupNum);

        //console.log('index: ' + index);
        
        if(index < 0){
            deleted_tasks.splice(deleted_tasks.indexOf(groupNum), 1);
        }
    }
}

function removeTempTasks(){

    var ev_count_with_temps = flashTeamsJSON['events'].length;
    //console.log('inside remove temp tasks');
    
    // if(deleted_tasks.length > 0){
    //     for (var i=0;i<deleted_tasks.length;i++){
    //        //deleteEvent(deleted_tasks[i]);
    //         removeTask(deleted_tasks[i]);
    //     }

    for (var i = 0; i < flashTeamsJSON['events'].length; i++) {
        if (flashTeamsJSON['events'][i].status == "deleted") {
            deleteEvent(flashTeamsJSON['events'][i].id);
        }
    }

    var ev_count_without_temps = flashTeamsJSON['events'].length;

    //console.log('with temps: ' + ev_count_with_temps + ", without temps: " + ev_count_without_temps);

    return (ev_count_with_temps == ev_count_without_temps); 

}

function showTempEvent(eventObject, closeModal){
    var eventToDuplicate = eventObject;

    var groupNum = eventToDuplicate['id'];
    var x = eventToDuplicate["x"] + 4;

    var y = eventToDuplicate["y"]; //keep event on same row as original event
    
    var snapPoint = calcSnap(x,y); 

    //check if duplicated row would be within the bounds of the timeline (e.g., doesn't exceed the rows)  
    if(!checkWithinTimelineBounds(snapPoint)){ 
        alert('This event cannot be duplicated because it exceeds the boundaries of the timeline');
        return; 
    }

    var eventObj = createEventObj(newEventObject([snapPoint[0], snapPoint[1]], eventToDuplicate["duration"], eventToDuplicate));

    eventObj['id'] = eventToDuplicate['id'];
    eventObj['status'] = "deleted"
    drawEvent(eventObj, true);

    if(closeModal == true){
        $('#task_modal').modal('hide'); 
    }
}


