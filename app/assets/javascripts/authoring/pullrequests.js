var master_id = $("#parent_team_id").val();
var pull_request_id = $("#pull_request_id").val();

function get_latest_master(handler) {
    $.ajax({
        url: '/flash_teams/' + master_id + '/get_status',
        type: 'get',
    }).done(handler);
};

function update_master(new_json) {
    $.ajax({
        url: '/flash_teams/' + master_id + '/update_status',
        type: 'post',
        data: new_json,
        dataType: 'json',
    }).done(function(result){
        console.log("updated master");
    });
};

function update_pull_request(data) {
    $.ajax({
        url: '/pull_requests/' + pull_request_id + '/update',
        type: 'put',
        dataType: 'json',
        data: data,
    }).done(function(result){
        console.log("updated pull request");
    });
};

// the arguments are 'flashTeamsJSON' objects of their respective teams
function merge(into, ancestor, from) {
    var diff = diff3lib.threeWayMerge(into, ancestor, from);
    return diff3lib.patch(diff.diff, into, from);
}

// when master is merged into the branch, the ancestor is no
// longer the original master. instead, it is updated to be the
// latest master, since the branch has been "refreshed"
function merge_master_into_branch(branch, ancestor){
    get_latest_master(function(latest_master){
        var new_json = merge(branch, ancestor, latest_master);
        update_pull_request({new_json: new_json, ancestor_json: latest_master});
    });
};

function merge_branch_into_master(master, ancestor, branch) {
    get_latest_master(function(latest_master){
        var new_json = merge(latest_master, ancestor, branch);
        update_master(new_json);
        update_pull_request({status: "merged"});
    });
};
