var drawBlueBoxes = function(){
    for (var i=0;i<drawn_blue_tasks.length;i++){
        var ev = flashTeamsJSON["events"][getEventJSONIndex(drawn_blue_tasks[i])];
        var task_g = getTaskGFromGroupNum(drawn_blue_tasks[i]);
        drawBlueBox(ev, task_g);
    }
};

var drawOrangeBoxes = function(){
    setTimeout(function () {
        var changed_events_ids = flashTeamsJSON.diff.changed_events_ids.concat(flashTeamsJSON.diff.added_events_ids)
        if(changed_events_ids) {
            for (var i=0;i<changed_events_ids.length;i++){
                var ev = flashTeamsJSON["events"][getEventJSONIndex(changed_events_ids[i])];
                var task_g = getTaskGFromGroupNum(changed_events_ids[i]);
                drawOrangeBox(ev, task_g);
            }
        }
    }, 100)
};

var drawRedBoxes = function(){
    for (var i=0;i<completed_red_tasks.length;i++){
        var ev = flashTeamsJSON["events"][getEventJSONIndex(completed_red_tasks[i])];
        var task_g = getTaskGFromGroupNum(completed_red_tasks[i]);
        drawRedBox(ev, task_g, false);
    }
};

var drawDelayedTasks = function(){
    var cursor_x = parseFloat(cursor.attr("x1"));
    var before_tasks = computeTasksBeforeCurrent(cursor_x);
    var tasks_after = null;
    var allRanges = [];

    for (var i=0;i<before_tasks.length;i++){
        var groupNum = parseInt(before_tasks[i]);
        var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
        var task_g = getTaskGFromGroupNum(groupNum);

        var completed = ev.completed_x;

        if (completed) continue;

        var id_remaining = remaining_tasks.indexOf(groupNum)
        if (id_remaining != -1) continue;

        var red_width = drawRedBox(ev, task_g, true);
        //console.log(" ^^^^^^^^^^^^^^^^^^^^^^ RED_WIDTH: " + red_width);
        var idx = live_tasks.indexOf(groupNum);
        if(idx != -1) {
            //console.log(" %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% found task " + groupNum + " in live_tasks");
            live_tasks.splice(idx, 1);
            delayed_tasks.push(groupNum);
        } else {
            //console.log(" %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% not even in live_tasks");
        }

        var groupNum = ev.id;
        var task_start = parseFloat(ev.x);
        var task_rect_curr_width = parseFloat(getWidth(ev));
        var task_end = task_start + task_rect_curr_width;
        var red_end = task_end + red_width;
        var new_tasks_after = computeTasksAfterCurrent(task_end); // TODO: right-most task or left-most task?
        if(tasks_after == null || new_tasks_after.length > tasks_after.length){
            tasks_after = new_tasks_after;
        }

        allRanges.push([task_end, red_end]);
    }

    var tasks_tmp = MoveLiveToRemaining(live_tasks,remaining_tasks);
    live_tasks = tasks_tmp["live"];
    remaining_tasks = tasks_tmp["remaining"];


    if (tasks_after != null){
        var actual_offset = computeTotalOffset(allRanges);
        //console.log("DRAWING DELAYED TASKS AFTER UPDATE");
        moveTasksRight(tasks_after, actual_offset, true);
    }
};

var drawBlueBox = function(ev, task_g){
    var completed_x = ev.completed_x;

    if (!completed_x){
        return null;
    }

    var groupNum = ev.id;

    var task_start = parseFloat(ev.x);
    var task_rect_curr_width = parseFloat(getWidth(ev));
    var task_end = task_start + task_rect_curr_width;
    var blue_width = task_end - completed_x;

    var existingBlueBox = task_g.selectAll("#early_rect_" + groupNum);
    if(existingBlueBox[0].length == 0) {
        task_g.append("rect")
            .attr("class", "early_rectangle")
            .attr("x", completed_x)
            .attr("y", function(d){ return d.y; })
            .attr("id", "early_rect_" + groupNum )
            .attr("groupNum", function(d){ return d.groupNum; })
            .attr("height", RECTANGLE_HEIGHT)
            .attr("width", blue_width)
            .attr("fill", "blue")
            .attr("fill-opacity", .6)
            .attr("stroke", "#5F5A5A");
    } else {
        existingBlueBox
            .attr("x", completed_x)
            .attr("width", blue_width);
    }

    return blue_width;
};

var drawRedBox = function(ev, task_g, use_cursor){

    var groupNum = ev.id;
    var task_start = parseFloat(ev.x);
    var task_rect_curr_width = parseFloat(getWidth(ev));
    var task_end = task_start + task_rect_curr_width;
    var completed_x = ev.completed_x;
    var red_width;
    if(!use_cursor){
        if (!completed_x){
            red_width = 1;
        } else {
            completed_x = parseFloat(completed_x);
            red_width = completed_x - task_end;
        }
    } else {
        var cursor_x = parseFloat(cursor.attr("x1"));
        red_width = cursor_x - task_end;
    }

    var existingRedBox = task_g.selectAll("#delayed_rect_" + groupNum);
    if(existingRedBox[0].length == 0) {
        task_g.append("rect")
            .attr("class", "delayed_rectangle")
            .attr("x", function(d) {return parseFloat(d.x) + task_rect_curr_width})
            .attr("y", function(d) {return d.y})
            .attr("id", function(d) {
                return "delayed_rect_" + groupNum; })
            .attr("groupNum", groupNum)
            .attr("height", RECTANGLE_HEIGHT)
            .attr("width", red_width)
            .attr("fill", "red")
            .attr("fill-opacity", .6)
            .attr("stroke", "#5F5A5A")
            .attr("display", "none");
    } else {
        existingRedBox
            .attr("width", red_width);
    }

    return red_width;
};

var drawOrangeBox = function(ev, task_g, use_cursor){

    var groupNum = ev.id;
    var events = window._foundry.events;
    var width = getWidth(ev) - 2 * events.marginLeft;
    var existingOrangeBox = task_g.selectAll("#changed_rect_" + groupNum);
    if(existingOrangeBox[0] && existingOrangeBox[0].length == 0) {
        task_g.append("rect")
            .attr("class", "changed_rectangle")
            .attr("x", function(d) {return d.x})
            .attr("y", function(d) {return d.y})
            .attr("id", function(d) {
                return "changed_rect_" + groupNum; })
            .attr("groupNum", groupNum)
            .attr("height", RECTANGLE_HEIGHT)
            .attr("width", width)
            .attr("fill", "#FFA500")
            .attr("fill-opacity", .6)
            .attr("stroke", "#5F5A5A")
    } else {
        existingOrangeBox
            .attr("width", width);
    }

    return width;
};
