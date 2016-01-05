/* helper.js
 * ---------------------------------
 * 
 */

//MAKE SURE THE JSON IS UPDATED IN ITS CURRENT VERSION EVERYWHERE
var flashTeamsJSON = {
    "title" : document.getElementById("ft-name").innerHTML,
    "id" : flash_team_id,
    "events": [],        //{"title", "id", "startTime", "duration", "notes", "members": [], "dri", "yPosition", inputs”:[], “outputs”:[]}
    "members": [],       //{"id", "role", "skills":[], "color", "category1", "category2"}
    "folders": [],
    "interactions" : [],  //{"event1", "event2", "type", "description", "id"}
    "author": document.getElementById("ft-author-name").innerHTML//,
   // "original_status": "original status",
    //"original_json": "original json"
};

function pressEnterKeyToSubmit(inputId, buttonId) {
	$(inputId).keydown(function(event){
		if(event.keyCode == 13){
			$(buttonId).click();
            return false;
		}
	});
}

//Find the total hours (duration) of the entire team
function findTotalHours() {
    var totalHours = 48; 
    for (i = 0; i < flashTeamsJSON["events"].length; i++) {
        var eventObj = flashTeamsJSON["events"][i];
        var eventStart = eventObj.startTime;
        var eventDuration = eventObj.duration;
        var eventEnd = eventStart + eventDuration;
        var hours = (eventEnd - (eventEnd%60))/60; 
        if (hours > totalHours) totalHours = hours;
    }
    //NOTE: the above cut off minutes past the hour, must add at least 1 extra hour to return val
    totalHours++; 
    return totalHours + 2; //THE 2 IS ARBITRARY FOR PADDING
}


//CALL IN CONSOLE TO HIDE THE CHAT BOX AND PROJECT STATUS
function hideAwareness() {
    var projCont = document.getElementById("project-status-container");
    projCont.style.display = "none";
    var chatCont = document.getElementById("chat-box-container");
    chatCont.style.display = "none";
}

// function saveFlashTeam() {
// 	console.log("Saving flash team");
    
//     var flash_team_id = $("#flash_team_id").val();
//     var authenticity_token = $("#authenticity_token").val();
//     var url = '/flash_teams/' + flash_team_id + '/update_json';
//     $.ajax({
//         url: url,
//         type: 'post',
//         data: {"flashTeamsJSON": flashTeamsJSON, "authenticity_token": authenticity_token}
//     }).done(function(data){
//         console.log("UPDATED FLASH TEAM JSON");
//     });
// }


function showJSONModal(id_array){
    loadOriginStatus(origin_id);

    var origin_ft_json = loadedOriginStatus.flash_teams_json;

    //console.log('normal:' + origin_ft_json);

    //console.log('stringify:' + JSON.stringify(origin_ft_json));

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

}

function mergeBranchToMaster(){

    var merged_json = diffMerge('branch-to-master');

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

}

//replaces flashTeamsJSON with the JSON from the origin team
function mergeMasterToBranch(){
    var merged_json = diffMerge('master-to-branch');

    flashTeamsJSON = merged_json;

    updateStatus();

    console.log('merged master to branch');

    pullMasterJSON();
}



//replaces flashTeamsJSON with the JSON from the origin team
function forcePullMasterJSON(){
    loadOriginStatus(origin_id);

    var origin_ft_json = loadedOriginStatus;

    flashTeamsJSON = origin_ft_json['flash_teams_json'];

    updateStatus();

    $("#flash_team_id").requestUpdates(true);

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


var diffs_obj; 
var deleted_tasks = [];

function showTasksDiffs(){
    $('#JSONDiffBtn').attr('onclick', 'hideTasksDiffs()');
    $('#JSONDiffBtn').prop('value', 'Hide Diffs');

    if(diffs_obj == undefined) {
     diffs_obj = testDiff() ;
    }
    //var diffs_obj = testDiff();

    for (var key in diffs_obj) {
        console.log(key, diffs_obj[key]);
        showDiffTask(key, diffs_obj[key]['type'], diffs_obj[key]['index'])
    }

    // showDiffTask("1451593588227", "add");
    // showDiffTask("1451586339736", "del");   
}

function hideTasksDiffs(){
    $('#JSONDiffBtn').attr('onclick', 'showTasksDiffs()');
    $('#JSONDiffBtn').prop('value', 'Show Diffs');

    // hideDiffTask("1451593588227");
    // hideDiffTask("1451586339736");

    //var diffs_obj = testDiff();

    // for (var key in diffs_obj) {
    //     hideDiffTask(key)
    // }
    for (var key in diffs_obj) {
        console.log(key, diffs_obj[key]);
        hideDiffTask(key, diffs_obj[key]['type'], diffs_obj[key]['index'])
    }
}

function testDiff(){
    //var tasksJSON = loadedStatus.task_groups;

    // $.each(tasksJSON, function(key, value){     
    //          if(((typeof key) == 'groupNum') && key=='1451935003770' )
    //              console.log('true');
    //        //ids.push(key);
    //     });

    var branch_events = getGroupNumArray(flashTeamsJSON['events']);

    //console.log(branch_events);

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

        if(arrayIndex == -1){
            //console.log(ancestor_events.indexOf(branch_events[i]));
            groupNumDiffs[ancestor_events[i]] = {"type": "del", "index": i}
            deleted_tasks.push(groupNumDiffs[ancestor_events[i]]);
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


