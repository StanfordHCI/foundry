var show_diff = false;



function showJSONModal(id_array){
    // loadOriginStatus(origin_id);
    // var origin_ft_json = loadedOriginStatus.flash_teams_json;

    if(show_diff == true){
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
        //$("#branch-json-div").css('class', 'span6');
        $("#branch-json-div").html('<h3>BRANCH JSON</h3>' + JSON.stringify(flashTeamsJSON));
    }

    if(team_type == 'branch'){
        $("#master-updated-json-div").html('<h3>MASTER UPDATED JSON</h3>' + JSON.stringify(origin_ft_json));
        $("#ancestor-json-div").html('<h3>ANCESTOR JSON</h3>' + JSON.stringify(ancestorBranch['flash_teams_json']));
        $("#branch-json-div").html('<h3>BRANCH JSON</h3>' + JSON.stringify(flashTeamsJSON));
    }

    $("#jsonModal").modal('show');

    });

}

function mergeBranchToMaster(){

    var merged_json = diffMerge('branch-to-master');
    //var merged_json = diffMergeAll('branch-to-master');

    var origin_ft_json = loadedOriginStatus;

    origin_ft_json['flash_teams_json'] = merged_json;

    var localStatusJSON = JSON.stringify(origin_ft_json);
        //console.log("updating string: " + localStatusJSON);

        var flash_team_id = origin_id;
        var authenticity_token = $("#authenticity_token").val();
        var url = '/flash_teams/' + flash_team_id + '/update_status';
        $.ajax({
            url: url,
            type: 'post',
            data: {"localStatusJSON": localStatusJSON, "authenticity_token": authenticity_token}
        }).done(function(data){
            console.log("UPDATED ORIGIN FLASH TEAM STATUS");
            loadOriginStatus(origin_id);
            
        });

        //updateAncestorBranch(loadedOriginStatus);
        pullMasterJSON();

        updateStatus();

        //loadData();
        $("#jsonModal").modal('hide');

}

//replaces flashTeamsJSON with the JSON from the origin team
function mergeMasterToBranch(){
    var merged_json = diffMerge('master-to-branch');
    //var merged_json = diffMergeAll('master-to-branch');

    flashTeamsJSON = merged_json;

    //updateStatus();

    console.log('merged master to branch');

    pullMasterJSON();

    updateStatus();

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

    console.log('pulled master json');

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

    //console.log(JSON.stringify(master_updated));
    var diff = branchmerge.threeWayMerge(master_updated, master, branch);
    console.log(JSON.stringify(diff, null, 3));
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

function diffMerge(merge_type){
    loadOriginStatus(origin_id);
    var master = ancestorBranch.flash_teams_json;
    
    var master_updated = loadedOriginStatus.flash_teams_json;
    var copied_master_updated = JSON.parse(JSON.stringify(master_updated));

    var branch = flashTeamsJSON;
    var copied_branch = JSON.parse(JSON.stringify(branch));

    //console.log(JSON.stringify(master_updated));
    var diff = branchmerge.threeWayMerge(master_updated, master, branch);
    console.log(JSON.stringify(diff, null, 3));
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
    console.log(JSON.stringify(diff, null, 3));

    return diff;
}


//var diffs_obj; 
var deleted_tasks = [];

function showTasksDiffs(){
    $('#JSONDiffBtn').attr('onclick', 'hideTasksDiffs()');
    $('#JSONDiffBtn').prop('value', 'Hide Diffs');

    if(diffs_obj == undefined) {
     diffs_obj = testDiff() ;
    }
    var diffs_obj = testDiff();

    for (var key in diffs_obj) {
        console.log(key, diffs_obj[key]);
        showDiffTask(key, diffs_obj[key]['type'], diffs_obj[key]['index'])
    }

    show_diff = true;

    // showDiffTask("1451593588227", "add");
    // showDiffTask("1451586339736", "del");   
}

function hideTasksDiffs(){
    $('#JSONDiffBtn').attr('onclick', 'showTasksDiffs()');
    $('#JSONDiffBtn').prop('value', 'Show Diffs');

    // hideDiffTask("1451593588227");
    // hideDiffTask("1451586339736");

    var diffs_obj = testDiff();

    // for (var key in diffs_obj) {
    //     hideDiffTask(key)
    // }
    for (var key in diffs_obj) {
        console.log(key + ":" + diffs_obj[key]);
        hideDiffTask(key, diffs_obj[key]['type'], diffs_obj[key]['index'])
    }

    show_diff = false;
}

function testDiff(){

    var branch_events = getGroupNumArray(flashTeamsJSON['events']);

    var ancestor_events = getGroupNumArray(ancestorBranch.flash_teams_json['events']);

    var groupNumDiffs = {} 

    for (var i=0;i<branch_events.length;i++){
        var arrayIndex = ancestor_events.indexOf(branch_events[i]);

        if(arrayIndex == -1){
            //console.log(ancestor_events.indexOf(branch_events[i]));
            groupNumDiffs[branch_events[i]] = {"type": "add", "index": i}
        }
    }

    for (var i=0;i<ancestor_events.length;i++){
        var arrayIndex = branch_events.indexOf(ancestor_events[i]);
        var groupNum = ancestor_events[i];

        if(arrayIndex == -1){
            //console.log(ancestor_events.indexOf(branch_events[i]));
            groupNumDiffs[ancestor_events[i]] = {"type": "del", "index": i}
            deleted_tasks.push(groupNum);
            deleted_tasks = jQuery.unique(deleted_tasks);
        }
        else{
            var indexOfJSON = getEventJSONIndex(groupNum);
            var eventObj = flashTeamsJSON["events"][indexOfJSON];
            if(eventObj.status == "deleted"){
                groupNumDiffs[ancestor_events[i]] = {"type": "del", "index": i}
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


function showDiffTask(groupNum, type, index) {

    var groupNum = groupNum;
    
    if(type == "add"){
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
        // var ancestor_branch = loadAncestorBranch(flash_team_id);
        // console.log('ancestor_branch: ' + ancestor_branch);
        //console.log('ancestorBranch events: ' + ancestorBranch.flash_teams_json['events']);
        //var indexOfJSON = getEventJSONIndexFromObj(ancestorBranch.flash_teams_json, groupNum);
        var indexOfJSON = index;
        //console.log('indexOfJSON: ' + indexOfJSON);

        var eventObj = ancestorBranch.flash_teams_json["events"][indexOfJSON];

        //console.log('eventObj: ' + JSON.stringify(eventObj));

        //var groupNum = 
        showTempEvent(eventObj);
        //var groupNum = eventObj["id"];

        console.log('groupNum: ' + groupNum);
    }
}

//Fires on show diff button
function hideDiffTask(groupNum, type, index) {

    if(type == "add"){
        var indexOfJSON = getEventJSONIndex(groupNum);
        var eventObj = flashTeamsJSON["events"][indexOfJSON];
        drawEvent(eventObj); //Will update color
    }
    if(type == "del"){
        console.log('calling hideDiffTask delete');
        //removeTask(groupNum);
        deleteEvent(groupNum)

        var index = deleted_tasks.indexOf(groupNum);

        console.log('index: ' + index);
        
        if(index < 0){
            deleted_tasks.splice(deleted_tasks.indexOf(groupNum), 1);
        }
    }
}

function removeTempTasks(){
    if(deleted_tasks.length > 0){
        for (var i=0;i<deleted_tasks.length;i++){
            deleteEvent(deleted_tasks[i]);
            removeTask(deleted_tasks[i]);
        }
    }
}
function showTempEvent(eventObject, closeModal){
    //var task_id = getEventJSONIndex(groupNumber);
    //var eventToDuplicate = flashTeamsJSON["events"][task_id];

    var eventToDuplicate = eventObject;

    var groupNum = eventToDuplicate['id'];


    //var x = eventToDuplicate["x"] + 4; //keep event X (and start time) the same as original event 
    //var x = (parseInt(eventToDuplicate["x"]) + parseInt(getWidth(eventToDuplicate) + 4 )); //move event (and start time) to the right of the event
    var x = eventToDuplicate["x"] + 4;


    var y = eventToDuplicate["y"]; //keep event on same row as original event
    //var y = eventToDuplicate["y"] + RECTANGLE_HEIGHT + 20;  //move event to row below original event
    
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

    }else{
    }
}


