/* Members.js
 * ---------------------------------
 *
 */


var memberCounter = undefined;
var colorToChange = "#ff0000";
var current = undefined;
var isUser = false;
var memberType; 

//WARNING: This has to be called once, and before any of the other colorBox functions!
function colorBox() {
    colorBox.colors = ["#00ffff","#f0ffff","#f5f5dc","#000000","#0000ff","#a52a2a","#00ffff",
    "#00008b","#008b8b","#a9a9a9","#006400","#bdb76b","#8b008b","#556b2f","#ff8c00","#9932cc",
    "#8b0000","#e9967a","#9400d3","#ff00ff","#ffd700","#008000","#4b0082","#f0e68c","#add8e6",
    "#e0ffff","#90ee90","#d3d3d3","#ffb6c1","#ffffe0","#00ff00","#ff00ff","#800000","#000080",
    "#808000","#ffa500","#ffc0cb","#800080","#800080","#ff0000","#c0c0c0","#ffff00"];
    for (var i = 0; i < flashTeamsJSON.members.length; i++){
        var ind = $.inArray(flashTeamsJSON.members[i].color, colorBox.colors);
        if (ind != 0) { //if found, remove from possible colors array
            colorBox.colors.splice(ind,1);
        }
    }
}

//grabColor returns a hex code not currently used by any member
colorBox.grabColor = function() {
    var ind = Math.floor(Math.random()*colorBox.colors.length);
    var color = colorBox.colors[ind];
    colorBox.colors.splice(ind,1);
    return color;
};

//replaceColor adds a color back into possible space
colorBox.replaceColor = function(color) {
    colorBox.colors.push(color);
};

 function renderMembersRequester() {
    var members = flashTeamsJSON.members;
    renderCurrentFolderPills();
    renderMemberPopovers(members);
    renderDiagram(members);
    renderAllMemberCircles();
};

function renderMembersUser() {
    var members = flashTeamsJSON.members;
    renderAllMemberCircles();
};

function setCurrentMember() {
    var uniq = getParameterByName('uniq');
    //console.log("THIS IS THE CURRENT UNIQ VALUE", uniq);
    
    if (uniq){
        $("#uniq").value = uniq;
        flash_team_members = flashTeamsJSON["members"];
        //console.log(flash_team_members[0].uniq);
        for(var i=0;i<flash_team_members.length;i++){            
            if (flash_team_members[i].uniq == uniq){
                current = flash_team_members[i].id;
                current_user = flash_team_members[i];
                isUser = true;
                memberType = flash_team_members[i].type;
            }
        }
    } else {
        current = undefined;
        isUser = false;
        memberType = "author";
    }
};

var folderClickFn = function(e) {
    closeOpenPopovers();
    entryManager.currentFolderId = $(this).attr('folder-id');
    renderCurrentFolderPills();
};

function createFolderElem(entry) {
    var elem = $( 
    '<div class="role-folder" folder-id="' + entry.id + '">' +
      '<div class="icon"></div>' +
      '<span class="name">' + entry.name +
        ' (' + entry.numMembers + ')</span>' +
      '<span class="delete-button"></span>' +
    '</div>');
    elem.click(folderClickFn);
    elem.find('.delete-button')
        .click(function(e) {
            e.stopPropagation();
            confirmDeleteFolder(entry.id);
        })
        .attr('data-toggle', 'tooltip')
        .tooltip('destroy')
        .tooltip({
            placement: 'right',
            title: 'Delete \'' +  entry.name + '\''
        });
    
    return elem;
}

function createRoleElem(member) {
  return $(
  '<div class="role" id="mPill_' + member.id + '">' + 
    '<div class="indicator" style="background-color:' + member.color + '"></div>' +
    '<span class="name">' + member.role + '</span>' +
    '<div class="clear"></div>' +
  '</div>');
}

/**
 * Updates the text for any display of the number of roles
 * (e.g. a span with the class "num-roles") with the value
 * passed as num
 */
function updateNumRolesDisplay(num) {
  // Update the number of roles display
  var numRolesDisplays = $('.num-roles');
  for(var i = 0; i < numRolesDisplays.length; i++) {
    numRolesDisplays[i].innerHTML = num;
  }
}

function renderPills(entries) {
    var foldersWrap = $(".foldersWrap");
    var membersWrap = $(".membersWrap");
    foldersWrap.html("");
    membersWrap.html("");
    for(var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var elem = entry.type === "folder" ?
            foldersWrap.append(createFolderElem(entry)) :
            membersWrap.append(createRoleElem(entry));
    }
    
    renderMemberPopovers(entries);
    updateNumRolesDisplay(flashTeamsJSON.members.length);
};

function renderCurrentFolderPills() {
    var currentFolder = entryManager.getEntryById(entryManager.currentFolderId);
    var names = entryManager.getEntryParentNames(currentFolder);
    names.push(currentFolder.name);
    var ids = entryManager.getEntryParentIds(currentFolder);
    ids.push(currentFolder.id);
    
    var breadcrumbsHtml = [];
    for(var i = 0; i < names.length; i++) {
        breadcrumbsHtml.push(
            $("<a>")
                .attr("folder-id", ids[i])
                .text(names[i])
                .click(folderClickFn));
        breadcrumbsHtml.push(" › ");
    }
    breadcrumbsHtml.pop();
    $(".breadcrumbs").html(breadcrumbsHtml);
    renderPills(
        entryManager.getCurrentFolderChildren());
}


function renderMemberPopovers(members) {
    var len = members.length;
    for (var i=0;i<len;i++){
        var member = members[i];
        
        if(member.type === "folder") {
            continue;
        }
        
        var member_id = member.id;
        var member_name = member.role;
        var invitation_link = member.invitation_link;
        var member_type = member.type; 
        
        if(member_type==undefined){
	        member_type = "worker";
        }
        
        //console.log("member_id: " + member_id + " member_type: " + member_type);

        var content = '<form name="memberForm_' + member_id + '>'
        +'<div class="mForm_' + member_id + '">'
        +'<div class="input-append" > ' 
        +'<select class="category1Input" id="member' + member_id + '_category1">';

        var newColor = "'"+member.color+"'";

        var category1 = member.category1;
        var category2 = member.category2;
       
        
        // add the drop-down for two-tiered oDesk job posting categories on popover
        for (var key in oDeskCategories) {
            //console.log("category1");
            var option = document.createElement("option");
            if(key == category1){
                content += '<option value="' + key + '" selected>' + key + '</option>';
            } else {
                content += '<option value="' + key + '">' + key + '</option>';
            }
        }

        //reload or build category2 based on previously selected category 1
        content += '</select>';

        if (category1 == "--oDesk Category--" || category1 == ""){
            content += '<br><br><select class="category2Input" id="member' + member_id + '_category2" disabled="disabled">--oDesk Sub-Category--</select>';
        } else{

            content += '<br><br><select class="category2Input" id="member' + member_id + '_category2">'
            for (var j=0; j<oDeskCategories[category1].length; j++) {
                //console.log("category2");
                var key2 = oDeskCategories[category1][j];

                var option = document.createElement("option");
                if(key2 == category2){
                    content += '<option value="' + key2 + '" selected>' + key2 + '</option>';
                }
                else
                    content += '<option value="' + key2 + '">' + key2 + '</option>';
            }
            content += '</select>';
        }
        
        

        content += '<br><br><input class="skillInput" id="addSkillInput_' + member_id + '" type="text" data-provide="typeahead" placeholder="New oDesk Skill" />'
        +'<button class="btn" type="button" class="addSkillButton" id="addSkillButton_' + member_id + '" onclick="addSkill(' + member_id + ');">+</button>'
        +'</div>'
        +'<br>Skills:'  
        +'<ul class="nav nav-pills" id="skillPills_' + member_id + '">';

        var skills_len = member.skills.length;
        for(var j=0;j<skills_len;j++){
            var memberSkillNumber = j+1;
            var skillName = member.skills[j];
            content+='<li class="active" id="sPill_mem' + member_id + '_skill' + memberSkillNumber + '"><a>' + skillName 
            + '<div class="close" onclick="deleteSkill(' + member_id + ', ' + memberSkillNumber + ', &#39' + skillName + '&#39)">  X</div></a></li>';
        }

        content +='</ul>';
        
		content += 'Member Type: <select name="membertype" id="member' + member_id + '_type">';
		
		if(member_type == "worker"){
        	content += '<option value="worker" selected>Worker</option>';
        } else{
            content += '<option value="worker">Worker</option>';
        }
        
        if(member_type == "pc"){
        	content += '<option value="pc" selected>Project Coordinator</option>';
        } else{
            content += '<option value="pc">Project Coordinator </option>';
        }
        
        if(member_type == "client"){
        	content += '<option value="client" selected>Client</option>';
        } else{
            content += '<option value="client">Client</option>';
        }
                    
        content += '</select><br />';

        content += 'Member Color: <input type="text" class="full-spectrum" id="color_' + member_id + '"/>'
        +'<p><script type="text/javascript"> initializeColorPicker(' + newColor +'); </script></p>'

         +'<p><button class="btn btn-success" type="button" onclick="saveMemberInfo(' + member_id + '); updateStatus();">Save</button>      '
         +'<button class="btn btn-danger" type="button" onclick="confirmDeleteMember(' + member_id + ');">Delete</button>     '
         +'<button class="btn btn-default" type="button" onclick="confirmReplaceMember(' + member_id + '); updateStatus();">Replace</button>     '
         +'<button class="btn btn-default" type="button" onclick="hideMemberPopover(' + member_id + ');">Cancel</button><br><br>'
         
        + 'Invitation link: <a id="invitation_link_' + member_id + '" href="' + invitation_link + '" target="_blank">'
        + invitation_link
        + '</a>'
        +'</p></form>' 
        +'</div>';
        
        $("#mPill_" + member_id).popover('destroy');

        $("#mPill_" + member_id).popover({
            placement: "right",
            html: "true",
            class: "member",
            id: '"memberPopover' + member_id + '"',
            trigger: "click",
            title: '<div data-pk="' + member_id + '" class="popover-mname">' + member_name + '</div><a href="#" class="edit-mname"><i class="icon-pencil"></i></a>',
            content:  content,
            container: $("#member-container"),
            callback: function(){
               //$("#member" + member_id + "_type").val(member_type);
               $(".skillInput").each(function () {
                $(this).typeahead({source: oSkills})
            });  
           }
       });
       
        $("#mPill_" + member_id).off('click', generateMemberPillClickHandlerFunction(member_id));
        $("#mPill_" + member_id).on('click', generateMemberPillClickHandlerFunction(member_id));

        // append oDesk Skills input to popover
        $(document).ready(function() {
            pressEnterKeyToSubmit("#addSkillInput_" + member_id, "#addSkillButton_" + member_id);
        });
    }
};

function generateMemberPillClickHandlerFunction(mem_id) {
    return function() {
        memberPillClick(mem_id);
    };
}

function generateMemberCategoryChangeFunction(mem_id) {
    return function() {
        memberCategoryChange(mem_id);
    }
}

function memberPillClick(mem_id) {
    //Close all open popovers
    for (var i = 0; i<flashTeamsJSON["members"].length; i++) {
        var idNum = flashTeamsJSON["members"][i].id;
        if (idNum == mem_id) continue;
        $("#mPill_"+idNum).popover('hide');
    }
    $("#member" + mem_id + "_category1").off('change', generateMemberCategoryChangeFunction(mem_id));
    $("#member" + mem_id + "_category1").on('change', generateMemberCategoryChangeFunction(mem_id));
}

function memberCategoryChange(mem_id) {
    if ($("#member" + mem_id + "_category1").value === "--oDesk Category--") {
        $("#member" + mem_id + "_category2").attr("disabled", "disabled");
    } else {
        $("#member" + mem_id + "_category2").removeAttr("disabled");
        $("#member" + mem_id + "_category2").empty();

        var category1Select = document.getElementById("member" + mem_id + "_category1");
        var category1Name = category1Select.options[category1Select.selectedIndex].value;

        for (var j = 0; j < oDeskCategories[category1Name].length; j++) {
            var option = document.createElement("option");
            $("#member" + mem_id + "_category2").append("<option>" + oDeskCategories[category1Name][j] + "</option>");
        }
    }
}

function renderDiagram(members) {
    removeAllMemberNodes();
    for (var i=0;i<members.length;i++){
        var member = members[i];
        addMemberNode(member.role, member.id, "#808080");
    }
};

function newFolderObject(folderName, parentId) {
    return {
        name: folderName, parentId: parentId, type: "folder",
        id: generateMemberId(), childIds: [], numMembers: 0};
}

function newMemberObject(memberName) {
    var color = colorBox.grabColor();
    //return {"role":memberName, "id": memberCounter, "color":color, "skills":[], "category1":"", "category2":""};
    
    //note from DR: for now i am setting the member type in the json as "worker" by default since the member popover doesn't load until after you add the role. If the role gets changed in the popover and the user presses the save button, it will update the json with the new member type 
    return {"role":memberName, "id": generateMemberId(), "color":color, "type": "worker", "skills":[], "category1":"", "category2":"", "seenDocQs": []};
};

/**
 * @param {string} folderName
 * @param {string|number} [parentId]
 */
function addFolder(folderName, parentId) {
    if(folderName === "") {
        alert("Please enter a folder name");
        return;
    }

    if(parentId === undefined) {
        parentId = entryManager.currentFolderId;
    }
    
    var folderObject = newFolderObject(folderName, parentId);
    entryManager.addEntry(folderObject);
    
    renderCurrentFolderPills();
    updateStatus(false);
}

/**
 * @param {string|number} id
 */
function deletePopover(id) {
    $("#mPill_" + id).popover("destroy");
}

function closeOpenPopovers() {
    //Close all open popovers
    for (var i = 0; i < flashTeamsJSON["members"].length; i++) {
        var idNum = flashTeamsJSON["members"][i].id;
        $("#mPill_"+idNum).popover('hide');
    }
}

function addMember() {
    // retrieve member role
    var member_name = $("#addMemberInput").val();
    if (member_name === "") {
        alert("Please enter a member role.");
        return;
    }

    closeOpenPopovers();

    // clear input
    $("#addMemberInput").val(this.placeholder);

    // add member to json
    var members = flashTeamsJSON.members;
    var member_obj = newMemberObject(member_name);
    
    members.push(member_obj);
    entryManager.addEntry(member_obj);
    
    //update event popovers to show the new member
    var events = flashTeamsJSON.events;
   /* for(var i=0;i<events.length;i++){
       drawPopover(events[i], true, false);
    }*/

   renderCurrentFolderPills();
   // renderMemberPopovers(members);
   updateStatus(false);
   inviteMember(member_obj.id);
};


//Adds a needed skill to a member and updates JSON
function addSkill(memberId) {
    var skillName = $("#addSkillInput_" + memberId).val();
    if (skillName == "" || oSkills.indexOf(skillName) < 0) {
        alert("Not a valid oDesk skill");
        return;
    }

    //Update JSON
    var indexOfJSON = getMemberJSONIndex(memberId);
    flashTeamsJSON["members"][indexOfJSON].skills.push(skillName);

    var memberSkillNumber = flashTeamsJSON["members"][indexOfJSON].skills.length;
    $("#skillPills_" + memberId).append('<li class="active" id="sPill_mem' + memberId + '_skill' + memberSkillNumber + '"><a>' + skillName 
        + '<div class="close" onclick="deleteSkill(' + memberId + ', ' + memberSkillNumber + ', &#39' + skillName + '&#39)">  X</div></a></li>');
    $("#addSkillInput_" + memberId).val(this.placeholder);
};

function deleteSkill(memberId, pillId, skillName) {
    //Remove skill pill
    $("#sPill_mem" + memberId + '_skill' + pillId).remove();
    //Update JSON
    var indexOfJSON = getMemberJSONIndex(memberId);
    for (var i = 0; i < flashTeamsJSON["members"][indexOfJSON].skills.length; i++) {
        if (flashTeamsJSON["members"][indexOfJSON].skills[i] == skillName) {
            flashTeamsJSON["members"][indexOfJSON].skills.splice(i, 1);
            break;
        }
    }
};


//NOTE FROM DR: I THINK WE CAN ERASE THIS B/C THERE IS ANOTHER ONE BELOW WITH SAME EXACT NAME (BUT CHECK THAT CODE IS THE SAME)
//Saves info and updates popover, no need to update JSON, done by individual item elsewhere
/*
function saveMemberInfo(popId) {
    var indexOfJSON = getMemberJSONIndex(popId);

    flashTeamsJSON["members"][indexOfJSON].category1 = document.getElementById("member" + popId + "_category1").value;
    flashTeamsJSON["members"][indexOfJSON].category2 = document.getElementById("member" + popId + "_category2").value;
    
    flashTeamsJSON["members"][indexOfJSON].type = document.getElementById("member" + popId + "_type").value;

    var newColor = $("#color_" + popId).spectrum("get").toHexString();

    updateMemberPillColor(newColor, popId);
    renderMemberPillColor(popId);

    $("#mPill_" + popId).popover("hide");
    renderAllMemberLines();
    renderMemberPopovers(flashTeamsJSON["members"]);
};
*/


//Shows an alert asking to confirm delete member role
function confirmDeleteMember(pillId) {
    var member = entryManager.getEntryById(pillId);
    
    var labelHtml = "Remove Member?";
    var alertHtml = "<b>Are you sure you want to remove " + member.role +
        " from " + flashTeamsJSON["title"]+ "? </b><br><font size = '2'>" +
        member.role + " will be removed from all events on the timeline. </font>";
    var deleteButtonHtml = "Remove member";
    
    //Calls deleteMember function if user confirms the delete
    var confirmFn = function(){
      deleteEntry(pillId)
    };
    confirmDeleteAction(labelHtml, alertHtml, deleteButtonHtml, confirmFn);
}

function confirmDeleteFolder(folderId) {
    var folder = entryManager.getEntryById(folderId);
    var size = folder.childIds.length;
    
    var labelHtml = "Remove Folder?";
    var alertHtml = "<b>Are you sure you want to remove " + folder.name +
        " from " + flashTeamsJSON["title"]+ "? </b>" +
        (size > 0 ? "This folder's contents will be removed as well.": "");
    var deleteButtonHtml = "Remove folder";
    var confirmFn = function() {
        deleteEntry(folderId);
    };
    
    confirmDeleteAction(labelHtml, alertHtml, deleteButtonHtml, confirmFn);
}

function confirmDeleteAction(labelHtml, alertHtml, deleteButtonHtml, confirmFn) {
    // label
    document.getElementById("confirmActionLabel")
        .innerHTML = labelHtml;
    
    // alert text
    document.getElementById("confirmActionText")
        .innerHTML = alertHtml;
    
    // delete button 
    $("#confirmButton").html(deleteButtonHtml)
        .attr("class", "btn btn-danger")
        .off()
        .click(confirmFn);
    
    $("#confirmAction").modal("show");
}

//Delete team member from team list, JSON, diagram, and events
function deleteEntry(memberId) {
    var entry = entryManager.getEntryById(memberId);
    // recursively delete folders
    if(entryManager.isFolder(entry)) {
        for(var i = 0; i < entry.childIds.length; i++) {
            deleteEntry(entry.childIds[i]);
        }
    } else {
        $('#confirmAction').modal('hide');
        for(var i = 0; i < flashTeamsJSON.members.length; i++) {
            var member = flashTeamsJSON.members[i];
            if(member.id == memberId) {
                flashTeamsJSON.members.splice(i, 1);
            }
        }

        // remove from members array with event object
        for(var i=0; i<flashTeamsJSON["events"].length; i++){
            var ev = flashTeamsJSON["events"][i];
            var member_event_index = ev.members.indexOf(memberId);
            // remove member
            if(member_event_index != -1){ // found member in the event
                deleteEventMember(ev.id, memberId);
            }

            //remove dri if the member was a dri
            if (ev.dri == String(memberId)){
                ev.dri = "";
            }
        }
    }
    
    entryManager.removeEntry(memberId);
    
    deletePopover(memberId);
    
    renderCurrentFolderPills();
    updateStatus(false);
};

//Calling this one
//Saves info and updates popover, no need to update JSON, done by individual item elsewhere
function saveMemberInfo(memberId) {
    var member = entryManager.getEntryById(memberId);
    member.category1 = document.getElementById("member" + memberId + "_category1").value;
    member.category2 = document.getElementById("member" + memberId + "_category2").value;
    member.type = document.getElementById("member" + memberId + "_type").value;
    
    var newColor = $("#color_" + memberId).spectrum("get").toHexString();

    updateMemberPillColor(newColor, memberId);
    renderMemberPillColor(memberId);

    $("#mPill_" + memberId).popover("hide");
    renderAllMemberCircles();
    renderMemberPopovers(entryManager.getCurrentFolderChildren());
};

//Close the popover on a member to "cancel" the edit
function hideMemberPopover(memberId) {
    $("#mPill_" + memberId).popover("hide");
}

function inviteMember(pillId) {
    var flash_team_id = $("#flash_team_id").val();
    var url = '/members/' + flash_team_id + '/invite';
    var member = entryManager.getEntryById(pillId);
    var data = {uniq: member.uniq};
    $.get(url, data, function(data){
        member.uniq = data["uniq"];
        member.invitation_link = data["url"];
        renderMemberPopovers(entryManager.getCurrentFolderChildren());
        updateStatus(false);
    });
}

function reInviteMember(pillId) {
    $('#confirmAction').modal('hide');

    var flash_team_id = $("#flash_team_id").val();
    var url = '/members/' + flash_team_id + '/reInvite';
    var member = entryManager.getEntryById(pillId);
    var data = {uniq: member.uniq };
    $.get(url, data, function(data){
        member.uniq = data["uniq"];
        member.invitation_link = data["url"];
        renderMemberPopovers(entryManager.getCurrentFolderChildren());
        updateStatus();
    });
};

function confirmReplaceMember(pillId) {
    var memberToReplace = entryManager.getEntryById(pillId).role;

    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "Replace Member?";

    var alertText = document.getElementById("confirmActionText");
    alertText.innerHTML = "<b>Are you sure you want to replace " + memberToReplace + "? </b><br><font size = '2'>  The current " 
                + memberToReplace + " will no longer have access to " + flashTeamsJSON["title"] + " and you will need to hire a new " + memberToReplace + ".</font>";

    var deleteButton = document.getElementById("confirmButton");
    deleteButton.innerHTML = "Replace member";

    $('#confirmAction').modal('show');

    //Calls reInviteMember function if user confirms the replace
    document.getElementById("confirmButton").onclick=function(){reInviteMember(pillId)};

}

function renderMemberPillColor(memberId) {
    // var indexOfJSON = getMemberJSONIndex(memberId);
    // var color = flashTeamsJSON["members"][indexOfJSON].color;

    var color = entryManager.getEntryById(memberId).color;
    
    var pillLi = document.getElementById("mPill_" + memberId);
    pillLi.childNodes[0].style.backgroundColor = color;
};

//Takes the new color, turns into hex and changes background color of a pill list item
function updateMemberPillColor(color, memberId) {
    // var indexOfJSON = getMemberJSONIndex(memberId);
    // flashTeamsJSON["members"][indexOfJSON].color = color;
    entryManager.getEntryById(memberId).color = color;
    updateStatus(false);
};

//Necessary to save member popover information
function updateMemberPopover(idNum) {
    $("#mPill_" + idNum).data('popover').options.content = "";
};

//Draws the color picker on a member popover
function initializeColorPicker(newColor) {

    $(".full-spectrum").spectrum({
        showPaletteOnly: true,
        showPalette: true,
        color: newColor,
        palette: [
        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
        "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(0, 255, 0)",
        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
        ["rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(182, 215, 168)", 
        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)"], 
        ["rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(100, 196, 100)", 
        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)"],
        ["rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(0, 168, 0)",
        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)"],
        ["rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)",  "rgb(39, 78, 19)", 
        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
        ],
        change: function(color) {
            colorToChange = color.toHexString();
        }
    });
}

function initializeMemberCounter() {
    if (flashTeamsJSON["members"].length == 0) return 0; 
    else {
        var highestId = 0;
        for (i = 0; i < flashTeamsJSON["members"].length; i++) {
            if (flashTeamsJSON["members"][i].id > highestId) {
                highestId = flashTeamsJSON["members"][i].id;
            }
        }
        return highestId;
    }
}

function generateMemberId() {
    return (new Date()).getTime();
}

//Find the index of a member in the JSON object "members" array by using unique id
function getMemberJSONIndex(idNum) {
    for (var i = 0; i < flashTeamsJSON["members"].length; i++) {
        if (parseInt(flashTeamsJSON["members"][i].id) == parseInt(idNum)) return i; 
    }
    return -1;
};

function getMemberById(id) {
    var idx = getMemberJSONIndex(id);
    if(idx != -1){
        return flashTeamsJSON["members"][idx];
    }
    return null;
};

function searchById (arr, id) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
            return i;
        }
    }
};

$(document).ready(function() {
    pressEnterKeyToSubmit("#addMemberInput", "#addMemberButton");
});

$(document).on('click', '.edit-mname', function(e) {
    e.stopPropagation();
    e.preventDefault();
    var target = $(this).parent().find('.popover-mname')[0];
    $(target).editable({
        mode: 'inline',
        success: function(response, newValue) { //Value has changed, check clicked
            updateRoleName($(target).attr('data-pk'), newValue);

            $(target).editable('destroy');
            renderMemberPopovers(entryManager.getCurrentFolderChildren());
        }
    });
    //Remove the editable-click attribute so no underline when you don't change the name
    $(target).removeClass("editable-click");
    $(target).editable('toggle');
});

function updateRoleName(id, newValue) {
    var member = entryManager.getEntryById(id);
    member.role = newValue;
    renderMemberPopovers(entryManager.getCurrentFolderChildren());
    updateStatus(false);
    $('#mPill_' + id + ' .name').html(newValue);
}

//Populate the autocomplete function for the event members
//TO BE DELETED, WILL BE CHANGING TO A CHECKBOX SYSTEM
function addMemAuto() {
    var memberArray = new Array(flashTeamsJSON["members"].length);
    for (i = 0; i < flashTeamsJSON["members"].length; i++) {
        memberArray[i] = flashTeamsJSON["members"][i].role;
    }

    $(".eventMemberInput").each(function() {
        $(this).autocomplete({
            source: memberArray
        });
    })
};
