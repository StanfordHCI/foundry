/* popovers.js
 * ---------------------------------------------
 * Code that manages the popovers
 * Drawing them on first event create/drop, update events on timeline
 * when new information added including: duration, event members, etc.
 */

// Quick hack that allows popovers to take callback functions
var tmp = $.fn.popover.Constructor.prototype.show; 
$.fn.popover.Constructor.prototype.show = function () { 
    tmp.call(this); 
    if (this.options.callback) { 
        this.options.callback(); 
    } 
};

/*
 * Input(s): 
 * eventObj - event object taken from the events array within the flashTeamsJSON object
 * 
 * Output(s):
 * an object that contains all info necessary to render an 'editable' popover
 */

 /*imported popover to modal
function editablePopoverObj(eventObj) {
    var totalMinutes = eventObj["duration"];
    var groupNum = eventObj["id"];
    var title = eventObj["title"];
    var startHr = eventObj["startHr"];
    var startMin = eventObj["startMin"];
    var notes = eventObj["notes"];
    var inputs = eventObj["inputs"];
    if(!inputs) inputs = "";
    var outputs = eventObj["outputs"];
    if(!outputs) outputs = "";
    var numHours = Math.floor(totalMinutes/60);
    var minutesLeft = totalMinutes%60;
    var dri_id = eventObj.dri;
    
    var obj = {
        placement: "right",
        html: "true",
        class: "eventPopover",
        id: '"popover' + groupNum + '"',
        trigger: "manual",
        title: '<input type ="text" name="eventName" id="eventName_' + groupNum 
            + '" placeholder="'+title+'" >',
        content: '<div class="event-popover-table">' 
        + '<form name="eventForm_' + groupNum + '">' 
        + '<div class="event-table-wrapper">'
        + '<b>Event Start:</b> <br>' 
        + 'Hours: <input type="number" id="startHr_' + groupNum + '" placeholder="' + startHr 
            + '" min="0" style="width:35px">         ' 
        + 'Minutes: <input type="number" id="startMin_' + groupNum + '" placeholder="' + startMin 
            + '" min="0" step="15" max="45" style="width:35px"><br />'
        + '<b>Total Runtime: </b> <br />' 
        + 'Hours: <input type = "number" id="hours_' + groupNum + '" placeholder="'
            +numHours+'" min="0" style="width:35px"/>         ' 
        + 'Minutes: <input type = "number" id = "minutes_' + groupNum + '" placeholder="'+minutesLeft
            +'" style="width:35px" min="0" step="15" max="45"/> <br />'
        + '<b>Members</b><br /> <div id="event' + groupNum + 'memberList">'
            + writeEventMembers(eventObj)  +'</div>'
        + '<b>Directly-Responsible Individual</b><br><select class="driInput"' 
            +' name="driName" id="driEvent_' + groupNum + '"' 
			+ 'onchange="getDRI('+groupNum + ')">'+ writeDRIMembers(groupNum,dri_id) +'</select>'
        + '<br /><b>Notes: </br></b><textarea rows="3" id="notes_' + groupNum + '">' + notes + '</textarea>'
        + '<div><input type="text" value="' + inputs + '" placeholder="Add input" id="inputs_' + groupNum + '" /></div>'
        + '<div><input type="text" value="' + outputs + '" placeholder="Add output" id="outputs_' + groupNum + '" /></div></div>'
        + '<div class="event-table-row event-table-footer">' 

        + '<button class="btn btn-success" type="button" id="save"'
        	+' onclick="saveEventInfo(' + groupNum + '); hidePopover(' + groupNum + ')">Save</button>       '  
        + '<button type="button" class="btn btn-danger" id="delete"'
            +' onclick="confirmDeleteEvent(' + groupNum +');">Delete</button>       ' 
		+ '<a id="cancel" style="float: right; line-height: 20px; padding-top: 4px; padding-bottom: 4px; margin-top: 2px;" onclick="hidePopover(' + groupNum + ');">Cancel</a>'       
        + '</div>'
        + '</form></div>',
        container: $("#timeline-container"),
        callback: function() {
            //$("input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput();
            $("#inputs_" + groupNum).tagsinput();
            $("#outputs_" + groupNum).tagsinput();
        }
    };

    return obj;
};
*/

/*
 * Input(s): 
 * eventObj - event object taken from the events array within the flashTeamsJSON object
 * 
 * Output(s):
 * an object that contains all info necessary to render an 'editable' popover
 */
/*imported popover to modal
function readOnlyPopoverObj(ev) {
    var groupNum = ev.id;
    var hrs = Math.floor(ev.duration/60);
    var mins = ev.duration % 60;

    var content = '<b>Event Start:</b><br>'
        + ev.startHr + ':'
        + ev.startMin.toFixed(0) + '<br>'
        +'<b>Total Runtime: </b><br>' 
        + hrs + ' hrs ' + mins + ' mins<br>';

    if(ev.inputs) {
        content += '<b>Inputs:</b><br>';
        var inputs = ev.inputs.split(",");
        for(var i=0;i<inputs.length;i++){
            content += inputs[i];
            content += "<br>";
        }
    }
    
    if(ev.outputs) {
        content += '<b>Outputs:</b><br>';
        var outputs = ev.outputs.split(",");
        for(var i=0;i<outputs.length;i++){
            content += outputs[i];
            content += "<br>";
        }
    }

    var num_members = ev.members.length;
    if(num_members > 0){
        content += '<b>Members:</b><br>';
        for (var j=0;j<num_members;j++){
            var member = getMemberById(ev.members[j]);
            content += member.role;
            content += '<br>';
        }
    }

     if (ev.dri != "" && ev.dri != undefined){
        var dri_id = parseInt (ev.dri);
        var mem = null;

        for (var i = 0; i<flashTeamsJSON["members"].length; i++){
           
            if(flashTeamsJSON["members"][i].id == dri_id){
                mem = flashTeamsJSON["members"][i].role;
                break;
            }
        }

        if(mem && mem != undefined){
            content += '<b>Directly-Responsible Individual:</b><br>';
            content += mem;
            content += '<br>';
        }
    }
    
    if (ev.content != ""){
        content += '<b>Notes:</b><br>';
        content += ev.notes;
        content += '<br>';
    }

    content += '<br><form><button type="button" class="btn btn-success" id="complete_' + groupNum 
        + '" onclick="confirmCompleteTask(' + groupNum + ');">Complete</button>'
        + ' <button type="button" class="btn btn-default" id="ok"'
        +' onclick="hidePopover(' + groupNum + ');">Ok</button></form>';
    
    var obj = {
        title: ev.title,
        content: content,
        placement: "right",
        html: "true",
        class: "eventPopover",
        id: '"popover' + groupNum + '"',
        trigger: "manual",
        container: $("#timeline-container")
    };

    return obj;
}
*/

/*
 * Draw popover on event.
 *
 * Input(s):
 * eventObj - event object taken from the events array within the flashTeamsJSON object
 * editable - boolean specifying whether to render an editable (true) or readonly (false) popover
 * show - boolean specifying whether to show the popover after rendering it
 *
 * Output(s):
 * None
 */

/*imported popover to modal
function drawPopover(eventObj, editable, show) {
   var groupNum = eventObj.id;
     // draw it
    var data = getPopoverDataFromGroupNum(groupNum); //SOMETHING WRONG, RETURNS UNDEFINED
    if(!data){ // popover not set yet
        if(editable){
            setPopoverOnTask(groupNum, editablePopoverObj(eventObj));
        } else {
            setPopoverOnTask(groupNum, readOnlyPopoverObj(eventObj));
        }
    } else { // update the popover's content
        var obj;
        if(editable){
            obj = editablePopoverObj(eventObj);
        } else {
            obj = readOnlyPopoverObj(eventObj);
        }
        data.options.title = obj["title"];
        data.options.content = obj["content"];
    }
    // show/hide it
    if(show){
        showPopover(groupNum);
    }
   
   // allow using return key to save and close the popover
    $(document).ready(function() {
        pressEnterKeyToSubmit("#eventMember_" + groupNum, "#addEventMember_" + groupNum);
    });
};
*/

/*imported popover to modal
function updateAllPopoversToReadOnly() {
    for(var i=0;i<flashTeamsJSON.events.length;i++) {
        var ev = flashTeamsJSON.events[i];
        drawPopover(ev, false, false);
    }
};
*/

/*imported popover to modal
var setPopoverOnTask = function(groupNum, obj){
    $(timeline_svg.selectAll("g#g_"+groupNum)[0][0]).popover(obj);
};
*/

/*imported popover to modal
function hidePopover(popId){
    //console.log("hiding popover " + popId);
    $(timeline_svg.selectAll("g#g_"+popId)[0][0]).popover('hide');
    //overlayOff();
};
*/
/*imported popover to modal
function showPopover(popId){
    //console.log("showing popover " + popId);
    $(timeline_svg.selectAll("g#g_"+popId)[0][0]).popover('show');
    //overlayOn();
};
*/

/*imported popover to modal
function togglePopover(popId){
    //console.log("showing popover " + popId);
    $(timeline_svg.selectAll("g#g_"+popId)[0][0]).popover('toggle');
    //overlayOn();
};
*/

/*imported popover to modal
function destroyPopover(popId){
    //console.log("destroying popover " + popId);
    $(timeline_svg.selectAll("g#g_"+popId)[0][0]).popover('destroy');
};
*/

/*imported popover to modal
var getPopoverDataFromGroupNum = function(groupNum){
   //console.log($(timeline_svg.selectAll("g#g_"+groupNum)[0][0]).data);
   return $(timeline_svg.selectAll("g#g_"+groupNum)[0][0]).data('popover');
};
*/

//Called when the user clicks save on an event popover, grabs new info from user and updates 
//both the info in the popover and the event rectangle graphics

/*imported popover to modal
function saveEventInfo (popId) {
    //Update title
    var newTitle = $("#eventName_" + popId).val();
    if (!newTitle == "") $("#title_text_" + popId).text(newTitle);
    else newTitle = $("#eventName_" + popId).attr("placeholder");

    //Get Start Time
    var startHour = $("#startHr_" + popId).val();    
    if (startHour == "") startHour = parseInt($("#startHr_" + popId).attr("placeholder"));
    var startMin = $("#startMin_" + popId).val();

    if (startMin == "") startMin = parseInt($("#startMin_" + popId).attr("placeholder"));
    //newX
    startHour = parseInt(startHour);
    startMin = parseInt(startMin);
    var newX = (startHour * 100) + (startMin/15*25);
    newX = newX - (newX%(STEP_WIDTH)) - DRAGBAR_WIDTH/2;

    var eventNotes = $("#notes_" + popId).val();
    var driId = getDRI(popId);
   
    var indexOfJSON = getEventJSONIndex(popId);
    var ev = flashTeamsJSON["events"][indexOfJSON];

    removeAllMemberCircles(ev);
    //Update members of event
    flashTeamsJSON["events"][indexOfJSON].members = [];
    for (var i = 0; i<flashTeamsJSON["members"].length; i++) {
        var member = flashTeamsJSON["members"][i];
        var memberId = member.id;
        var checkbox = $("#event" + popId + "member" + i + "checkbox")[0];
        if (checkbox == undefined) continue;
        if (checkbox.checked == true) {
            ev.members.push(memberId); //Update JSON
        } 
    }

    //Update width
    var newHours = $("#hours_" + popId).val();
    var newMin = $("#minutes_" + popId).val();
    if (newHours == "") newHours = parseInt($("#hours_" + popId)[0].placeholder);
    if (newMin == "") newMin = parseInt($("#minutes_" + popId)[0].placeholder);
    newMin = Math.round(parseInt(newMin)/15) * 15;
    
    //cannot have events shorter than 30 minutes
    if (newHours == 0 && newMin == 15){
        newMin = 30;
    }
    var newWidth = (newHours * 100) + (newMin/15*25);
  
    //Update JSON
    var indexOfJSON = getEventJSONIndex(popId);
    ev.title = newTitle;
    ev.notes = eventNotes;
    ev.dri = driId;
    ev.startHr = parseInt(startHour);
    ev.startMin = Math.round(parseInt(startMin)/15) * 15;
    ev.startTime = ev.startHr*60 + ev.startMin;
    ev.duration = durationForWidth(newWidth);
    ev.x = newX;
    ev.inputs = $('#inputs_' + popId).val();
    ev.outputs = $('#outputs_' + popId).val();

    drawEvent(ev, 0);
    drawPopover(ev, true, false);
    
    updateStatus(false);
};
*/

// Adds/updates the DRI dropdown on the event popover
function writeDRIMembers(idNum, driId){

	var indexOfJSON = getEventJSONIndex(idNum);
    var DRIString = '<option value="0">-- Choose DRI --</option>';
    var eventDRI = driId;
    
    // at some point change this to only members for that event (not all members in the flash team)
    if (entryManager.numMembers() == 0) return "No Team Members";
    
    entryManager.eachMember(function(member) {
        var memberName = member.role;
        var memberId = member.id;
        if (eventDRI == memberId){
            DRIString += '<option value="'+memberId+'"' + 'selected="selected">' + memberName + '</option>';
        }
        else{
            DRIString += '<option value="'+memberId+'">' + memberName + '</option>';
        }	
    });
    
    return DRIString;
}

// Adds/updates the PC dropdown on the event popover
function writePCMembers(idNum, PCId){

    var indexOfJSON = getEventJSONIndex(idNum);
    var PCString = '<option value="0">-- Choose PC --</option>';
    var eventPC = PCId;
    
    // at some point change this to only members for that event (not all members in the flash team)
    if (entryManager.numMembers() == 0) return "No Team Members";
    entryManager.eachMember(function(member) {
        var memberName = member.role;
        var memberId = member.id;
        if (eventPC == memberId){
            PCString += '<option value="'+memberId+'"' + 'selected="selected">' + memberName + '</option>';
        } else {
            PCString += '<option value="'+memberId+'">' + memberName + '</option>';
        }
    });
    
    return PCString;
}

// returns the id of the selected DRI in the DRI dropdown menu on the event popover 
function getDRI(groupNum) {    
    var dri = document.getElementById("driEvent");
    var driId;
   
    if (dri == null){
	     driId = 0;       
    }
    else{
	    var driId = dri.value;    
    }
    return driId;
}

function getPC(groupNum){
      var pc = document.getElementById("pcEvent");
    var pcId;
   
    if (pc == null){
         pcId = 0;       
    }
    else{
        var pcId = pc.value;    
    }
    return pcId;
}

//Adds member checkboxes onto the popover of an event, checks if a member is involved in event
function writeEventMembers(eventObj) {
    var memberString = "";
    var evMembers = eventObj.members;

    if (entryManager.numMembers() == 0) return "No Team Members";
    entryManager.eachMember(function(member, i) {
        var memberSearchId = member.id;
        var memberName = member.role;
        var found = false;
        for (var j = 0; j<evMembers.length; j++) {
            if (evMembers[j] == memberSearchId) {
                memberString += '<input type="checkbox" id="event' + eventObj["id"] + 'member' 
                    + i + 'checkbox" checked="true">' + memberName + "   <br>";
                found = true;
                break;
            }
        }
        if (!found) {
            memberString +=  '<input type="checkbox" id="event' + eventObj["id"] 
                + 'member' + i + 'checkbox">' + memberName + "   <br>"; 
        }
    });
    
    return memberString;
};