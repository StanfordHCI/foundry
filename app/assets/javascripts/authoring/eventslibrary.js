/* eventslibrary.js
* ---------------------------------------------
* Code that manages the searching and adding of events to the timeline in Foundry.
*
*/

// Reusable AJAX function, which takes 4 arguments, including: the ID of the input element (i.e. text field), the type of AJAX request (i.e. GET or POST), the 				URL for the AJAX request and the id for the container where the results will appear 

function callajaxreq(inputid, type, url, resultsid){
  
  // Setup AJAX request onclick
  var query_input = document.getElementById(inputid);

  query_input.onkeyup = function(event){
    
    var query_value = document.getElementById(inputid).value;
    var request = $.ajax({
      url: url,
      type: "GET",
      data: { params : query_value },
      dataType: "html"
    }); //end var request
   
    request.done(function( msg ) {
      $( "#" + resultsid ).html( msg );
    }); //end request.done

  }// end query_input.onkeyup

} //end callajaxreq

if(document.getElementById("searchEventsInput") != null){
    callajaxreq("searchEventsInput", "GET", "/flash_teams/event_search", "search-results");
}

//DR: I have no idea what the following three lines do
/* Dialog prompt code. Prevents dialogs from automatically opening upon initialization */
//$( "#teamRolesPrompt" ).dialog({ autoOpen: false });
//$( "#teamRolesPrompt" ).dialog({ height: "auto" },{ width: "450px" });
//$( "#teamRolesPrompt" ).dialog({ modal: true }); //creates overlay between dialog and rest of the web page in order to disables interactions with other page elements

/* Called when a user drags an event over the overlay div covering the timeline svg element, allowing overlay to catch and handle the drop */
function allowDrop(ev) {
  ev.preventDefault();
}

/* Called when an Event div is being dragged. */
function dragEvent(ev) {
  //console.log(ev);
  ev.dataTransfer.setData('eventHash', ev.target.getAttribute('data-hash'));
  ev.dataTransfer.setData("Text",ev.target.id); //saves id of dragged Event div into 'data'
}

/* Called when a user drops an event in a div that allows drop, in this case, overlay. Mouse coordinates at the point of drop are detected and members belonging to the dragged event and members belonging to the existing flash-team are compared */
function drop(ev) {
  ev.preventDefault();

  var targetHash = ev.dataTransfer.getData('eventHash');

  //calculates mouse coordinates relative to timeline svg to draw dragged event in corresponding location
  var mouseCoords = calcMouseCoords(ev); 

  //added createdragevent (and changed eventJSONId to eventJSONindex) here instead of compMember to test:
  createDragEvent(mouseCoords[0], mouseCoords[1], targetHash);

  //compares two members. Currently both are sample Member JSONs from MembersJSONArray, but should compared a team member from dragged Event and an existing team member in flash-team
  //compMember(MembersJSONArray[0], MembersJSONArray[2], mouseCoords, eventJSONindex); //TO BE CHANGED
}

/* Calculates mouse coordinates relative to timeline svg so Event block can be drawn in correct spot*/
function calcMouseCoords(event) {
  var timelineX = document.getElementById("timeline-container").offsetLeft;
  var timelineY = document.getElementById("timeline-container").offsetTop;

  var timelineScrollX = document.getElementById("timeline-container").scrollLeft;
  var timelineScrollY = document.getElementById("timeline-container").scrollTop;

  var absoluteX = event.pageX+timelineScrollX;
  var absoluteY = event.pageY+timelineScrollY;

  var svgpointX = absoluteX - timelineX;
  var svgpointY = absoluteY - timelineY;

  var svgpoint = [svgpointX, svgpointY];
  return svgpoint;
}

/* Creates event block on timeline with according pop up information*/
function createDragEvent(mouseX, mouseY, targetHash) {

   //WRITE IF CASE, IF INTERACTION DRAWING, STOP
   if(DRAWING_HANDOFF==true || DRAWING_COLLAB==true) {
       alert("Please click on another event or the same event to cancel");
       return;
   }

  var title = document.getElementById("title-" + targetHash).innerHTML;
  var duration = document.getElementById("duration-" + targetHash).innerHTML * 60;
  var inputs = document.getElementById("inputs-" + targetHash).innerHTML;
  var outputs = document.getElementById("outputs-" + targetHash).innerHTML;

  var snapPoint = calcSnap(mouseX, mouseY);
  console.log("mousex", mouseX);
  var startTimeObj = getStartTime(snapPoint[0]);

  var newEvent =  {
      "title":title, "id":createEventId(), "x": snapPoint[0], "min_x": snapPoint[0], "y": snapPoint[1], 
      "startTime": startTimeObj["startTimeinMinutes"], "duration":duration, "members":[], timer:0, task_startBtn_time:-1, task_endBtn_time:-1,
      "dri":"", "pc":"", "notes":"", "startHr": startTimeObj["startHr"], "status":"not_started",
      "startMin": startTimeObj["startMin"], "gdrive":[], "completed_x":null, "inputs":inputs, "outputs":outputs,
      "docQs": [["Please explain all other design or execution decisions made, along with the reason they were made",""], 
      ["Is there anything else you want other team members, the project coordinator, or the client, to know?",""]],
      "outputQs":{},"row": Math.floor((snapPoint[1]-5)/_foundry.timeline.rowHeight)}; 
  flashTeamsJSON.events.push(newEvent);

  drawEvent(newEvent);
  updateStatus(false);
};


//DR: I didn't touch any of the code below 

/* Compares the skills and second level category of two members. Depending on the comparison, may pop up dialog. Depending on dialog button chosen, may draw Event block onto timeline*/
function compMember(member1, member2, mouseCoords, eventJSONId) {
  var promptText;
  if (compMemberCats(member1, member2) || compMemberSkills(member1, member2)) { //if skills or second level category matches
    promptText = "This event requires a <b>"+member1["role"]+"</b> with skills overlapping those of your existing team member, <b>"
      +member2["role"]+"</b>. What would you like to do?";
    $( "#teamRolesPrompt" ).dialog({
      buttons: [ //3 options:
        {
          text: "Add this event but use an existing team member",
          click: function() {
            $( this ).dialog( "close" );
            createDragEvent(mouseCoords[0],mouseCoords[1],eventJSONId);
          }
        },
        {
          text: "Add this event and "+member1["role"]+" to my team",
          click: function() {
            $( this ).dialog( "close" );
            addMemberFromEvent(member1);
            createDragEvent(mouseCoords[0],mouseCoords[1],eventJSONId);
          }
        },
        {
          text: "Do not add this event and keep my team as is",
          click: function() {
            $( this ).dialog( "close" );
          }
        }
      ]
    });
    document.getElementById("teamRolesPrompt").innerHTML=promptText;
    $( "#teamRolesPrompt" ).dialog( "open" );
  } else { //else no matches, add Event block and its listed team members automatically
    addMemberFromEvent(member1);
    createDragEvent(mouseCoords[0],mouseCoords[1],eventJSONId);
    addMemberFromEvent(member1);
  }
}

/* Returns the 'inputs' of an Event JSON*/
function listInputs(event) {
  var inputs="";
  for (var i = 0; i < event["inputs"].length; i++) {
    inputs += event["inputs"][i];
    if (i < event["inputs"].length-1) {
      inputs += ", ";
    }
  }
  return inputs;
}

/* Returns the 'outputs' of an Event JSON*/
function listOutputs(event) {
  var outputs="";
  for (var i = 0; i < event["outputs"].length; i++) {
    outputs += event["outputs"][i];
    if (i < event["outputs"].length-1) {
      outputs += ", ";
    }
  }
  return outputs;
}

/* Returns the 'skills' of a Member JSON*/
function listSkills(member) {
  var skills="";
  for (var i = 0; i < member["skills"].length; i++) {
    skills += member["skills"][i];
    skills += "<br />";
  }
  return skills;
}

/* Compares second level category, or 'category2' of two members*/
function compMemberCats(member1, member2) {
  if (member1["category2"] == member2["category2"]) {
    return true;
  }
  return false;
}

/* Compares skills of two members*/
function compMemberSkills(member1, member2) {
  for (var i = 0; i < member1["skills"].length; i++) {
    for (var j=0; j < member2["skills"].length; j++) {
      if (member1["skills"][i] == member2["skills"][j]) {
        return true;
      }
    }
  }
  return false;
}

/* Called when a user chooses from the dialog to add a team member included in a dragged Event into the flash-team. Appends a pill under 'Team Roles' container and a popover to that pill populated with that member's data*/
function addMemberFromEvent(member) {
   memberCounter++;
  var memberName = member["role"];
   
  //Appends a list item pill to the memberPills ul
   $("#memberPills").append('<li class="active pill' + memberCounter + '" id="mPill_' + memberCounter + '""><a>' + memberName
       + '<div class="close" onclick="deleteMember(' + memberCounter + '); updateStatus(false);">  X</div>' + '</a></li>');

   //Clears Input
   $("#addMemberInput").val(this.placeholder);

   //Appends a popover to the pill
   $("#mPill_" + memberCounter).popover({
       placement: "right",
       html: "true",
       class: "member",
       id: '"memberPopover' + memberCounter + '"',
       trigger: "click",
       title: '<b>' + memberName + '</b>',
       content:  '<form name="memberForm_' + memberCounter + '" autocomplete="on">'
       +'<div class="mForm_' + memberCounter + '">'
           +'<div class="ui-front" class="input-append" > '
           +'<select class="category1Input" id="member' + memberCounter + '_category1"></select>'
           +'<br><br><select class="category2Input" id="member' + memberCounter + '_category2">--oDesk Sub-Category--</select>'
           +'<br><br><input class="skillInput" id="addSkillInput_' + memberCounter + '" type="text" onclick="addAuto()" placeholder="New oDesk Skill" autocomplete="on">'
           +'<button class="btn" type="button" class="addSkillButton" id="addSkillButton_' + memberCounter + '" onclick="addSkill(' + memberCounter + ');">+</button>'
           +'</div>'
           +'Skills:'  
           +'<ul class="nav nav-pills" id="skillPills_' + memberCounter + '"> </ul>'
           +'Member Color: <input type="text" class="full-spectrum" id="color_' + memberCounter + '"/>'
           +'<script type="text/javascript"> initializeColorPicker(); </script>'
           +'<p><button type="button" onclick="deleteMember(' + memberCounter + '); updateStatus(false);">Delete</button>     '
           +'<button type="button" onclick="saveMemberInfo(' + memberCounter + '); updateStatus(false);">Save</button>'
       +'</p></form>'
       +'</div>',
       container: $("#member-container")
   });

   $("#mPill_"+memberCounter).popover("show");

//Adds new member to Flash Teams JSON Object
   var newMember = {"role":memberName, "id": memberCounter, "color":"rgb(0, 168, 0)", "skills":[], "category1":"", "category2":""};
   // flashTeamsJSON.members.push(newMember);
   entryManager.addEntry(newMember);
   addMemberNode(memberName, memberCounter, "#808080");

   //Adds the drop-down for two-tiered oDesk job posting categories on popover and populates member attribute values
//Preset 'category1' attribute
   for (var key in oDeskCategories) {
if (member["category1"] == key) {
$("#member" + memberCounter + "_category1").append('<option value="' + key + '" selected>' + key + '</option>');
} else {
$("#member" + memberCounter + "_category1").append('<option value="' + key + '">' + key + '</option>');
}
   }
//Presets 'category2' attribute
var category1Select = document.getElementById("member" + memberCounter + "_category1");
   var category1Name = category1Select.options[category1Select.selectedIndex].value;
   for (i = 0; i < oDeskCategories[category1Name].length; i++) {
if (oDeskCategories[category1Name][i] == member["category2"]) {
$("#member" + memberCounter + "_category2").append("<option selected>" + oDeskCategories[category1Name][i] + "</option>");
} else {
$("#member" + memberCounter + "_category2").append("<option>" + oDeskCategories[category1Name][i] + "</option>");
}
   }
//Presets 'skills' attribute and add to flashteamsJSON
   var skillName;
var indexOfJSON = getMemberJSONIndex(memberCounter);
for (j = 0; j < member["skills"].length; j++) {
    skillName = member["skills"][j];
    // flashTeamsJSON["members"][indexOfJSON].skills.push(skillName);
    $("#skillPills_" + memberCounter).append('<li class="active" id="sPill_mem' + memberCounter + '_skill' + j + '"><a>' + skillName
           + '<div class="close" onclick="deleteSkill(' + memberCounter + ', ' + j + ', &#39' + skillName + '&#39)">  X</div></a></li>');
    $("#addSkillInput_" + memberCounter).val(this.placeholder);
}

   //Enables skills to be submitted by Enter key
   $(document).ready(function() {
       pressEnterKeyToSubmit("#addSkillInput_" + memberCounter, "#addSkillButton_" + memberCounter);
   });
};
