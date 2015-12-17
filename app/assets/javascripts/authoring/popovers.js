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

// Adds/updates the DRI dropdown on the event popover/modal
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

// Adds/updates the PC dropdown on the event popover/modal
function writePCMembers(idNum, PCId){

    var indexOfJSON = getEventJSONIndex(idNum);
    var PCString = '<option value="0">-- Choose Team Lead --</option>';
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