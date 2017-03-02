var master_id = $("#parent_team_id").val();
var pull_request_id = $("#pr_id").val();

function get_latest_master(handler) {
    $.ajax({
        url: '/flash_teams/' + master_id + '/get_status',
        type: 'get',
    }).done(function(data){
        handler(data.flash_teams_json);
    });
};

function update_master(new_json, success) {
    $.ajax({
        url: '/flash_teams/' + master_id + '/update_flash_teams_json',
        type: 'post',
        data: {"flashTeamsJSON": JSON.stringify(new_json)},
    }).done(success);
};

function update_pull_request(data) {
    $.ajax({
        url: '/pull_requests/' + pull_request_id,
        type: 'put',
        data: data,
    }).done(function(result){
        console.log("updated pull request with final merged pr");
    });
};

function pull_and_push(branch, ancestor, success, failure) {
    get_latest_master(function(latest_master){
        var diffed = xdiff.diff3Teams(branch, ancestor, latest_master);
        if (diffed.conflicts.length > 0) {
            failure(diffed.conflicts);
        } else {
            var new_master = xdiff.patchTeam(diffed.diffs, ancestor);
            update_master(new_master, success);
        }
    });
}

function isBranch() {
    return flashTeamsJSON.team_type !== undefined && flashTeamsJSON.team_type == "branch";
};

function inReviewMode() {
    var params = window.location.search.replace("?", "");

    if(params=="review=true"){
        return true;
    } else {
        return false;
    }
};