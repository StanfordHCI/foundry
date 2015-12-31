/* Members.js
 * ---------------------------------
 *
 */

var memberCounter = undefined;
var colorToChange = "#ff0000";
var current = undefined;
var isUser = false;
var memberType; 

//Fixes 'sticky popover' issue when you blur window and popover freezes
 $(window).blur(function() {
    closeOpenPopovers();
 });

//WARNING: This has to be called once, and before any of the other colorBox functions!
function colorBox() {
    colorBox.colors = [
      // reds
      "#d24d57", "#e74c3c", "#c0392b", "#d35400", "#e67e22", "#e26a6a",
      
      // yellows
      "#f39c12", "#f1c40f", "#f7d85c",
      
      // greens
      "#87d37c", "#4f8e6a", "#2ecc71",  "#26a65b", "#2e762c",
      
      // aquas
      "#68c3a3", "#1bbc9b", "#1ba39c", "#22adad",
      
      // light blues
      "#81cfe0", "#22a7f0","#5c97bf", "#4ecdc4", "#446cb3",
      
      // blues
      "#39607c","#3498db", "#2980b9", "#34495e", "#336e7b", "#3a539b", "#2574a9", "#3f63c3",
      
      // purples
      "#674172", "#913d88", "#8e44ad", "#52201c",
      
      // pinks
      "#938ee2", "#b175ca","#9b59b6", "#f82c8a","#f2784b", "#d64541", "#e08283",
    ];
    
    colorBox.index = Math.floor(Math.random() * (colorBox.colors.length - 1));
}

//grabColor returns a hex code not currently used by any member
colorBox.grabColor = function() {
    var color = colorBox.colors[colorBox.index];
    colorBox.index = (colorBox.index + 1) % colorBox.colors.length;
    return color;
};

function renderMembersRequester() {
    var members = entryManager.getCurrentFolderChildren();
    renderCurrentFolderPills();
    renderMemberPopovers(members);
    renderAllMemberTabs();
};

function setCurrentMember() {
    var uniq = getParameterByName('uniq');
    
    if (uniq){
        $("#uniq").value = uniq;
        
        var member = entryManager.getEntryByUniq(uniq);
        if(member) {
            current = member.id;
            current_user = member;
            isUser = true;
            memberType = member.type;
            
            $('#member_role_span').html(current_user.role); //updates the "Your Role: " text in left sidebar

            if (member.type == "worker" && $('#member-container').css('display') != "none"){
                //console.log('member switched to worker role');
                $('#member-container').css('display', 'none');
            }
            if (member.type == "pc" && $('#member-container').css('display') == "none"){
                //console.log('member switched to pc role');
                $('#member-container').css('display', 'block');
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
    '<div class="role-folder" role-id="' + entry.id +'" folder-id="' + entry.id + '">' +
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

function createRoleElem(entry) {
  return $(
  '<div class="role" id="mPill_' + entry.id + '" role-id="' + entry.id + '">' + 
    '<div class="indicator" style="background-color:' + entry.color + '"></div>' +
    '<span class="name">' + entry.role + '</span>' +
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

/**
 * @param {jQuery} $elem
 * @param {jQuery} $folderElems
 */
function addPillDragFns($elem, $folderElems) {
    var dragging = false;
    var $copy = undefined;
    var $mouseOverElem = undefined;
    
    $elem.mousedown(function(e) {
        dragging = true;
        $elem.addClass('dragging');
        $copy = $elem.clone()
            .hide()
            .css({
                position: "absolute",
                width: $elem.width() + "px",
                background: "rgba(255,255,255,0.4"
            })
            .addClass("copy")
            .appendTo("body");
    });
    
    $(window).mousemove(function(e) {
        if(!dragging) {return;}
        e.preventDefault();
        $copy.show().css({
            left: e.pageX + "px",
            top: e.pageY + "px",
            zIndex: 99
        });
    });
    
    $(window).mouseup(function(e) {
        dragging = false;
        if($copy) { $copy.remove(); }
        $elem.removeClass('dragging');
        
        if($mouseOverElem) {
            e.preventDefault();
            
            var entryId = $elem.attr("role-id");
            var destId = $mouseOverElem.attr("role-id");
            
            logActivity("addPillDragFns($elem, $folderElems)",'Drag Member to Folder - Before', 
                new Date().getTime(), current_user, chat_name, team_id, entryManager.getEntryById(entryId));

            entryManager.moveEntry(entryId, destId);
            $elem.remove();
            $mouseOverElem.removeClass("accepting");
            $mouseOverElem = undefined;

            logActivity("addPillDragFns($elem, $folderElems)",'Drag Member to Folder - After', 
                new Date().getTime(), current_user, chat_name, team_id, entryManager.getEntryById(entryId));
            
            renderCurrentFolderPills();
            updateStatus();
        }
    });
    
    $folderElems.mouseover(function(e) {
        if(dragging && $(this)[0] != $elem[0]) {
            $mouseOverElem = $(this).addClass("accepting");
        }
    });
    
    $folderElems.mouseleave(function(e) {
        if($mouseOverElem && $mouseOverElem[0] == $(this)[0]) {
            $mouseOverElem = undefined;
            $(this).removeClass("accepting");
        }
    });
}

function renderPills(folder, entries) {
    var $foldersWrap = $(".foldersWrap");
    var $membersWrap = $(".membersWrap");
    $foldersWrap.html("");
    $membersWrap.html("");
    var elems = [];
    for(var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var $elem = entry.type === "folder" ?
            createFolderElem(entry).appendTo($foldersWrap) :
            createRoleElem(entry).appendTo($membersWrap);
        elems.push($elem);
    }
    
    var names = entryManager.getEntryParentNames(folder);
    names.push(folder.name);
    var ids = entryManager.getEntryParentIds(folder);
    ids.push(folder.id);
    
    var breadcrumbsHtml = [];
    for(var i = 0; i < names.length; i++) {
        var $breadcrumb = $("<a>")
                .addClass("breadcrumb")
                .addClass("role-folder")
                .attr("folder-id", ids[i])
                .attr("role-id", ids[i])
                .text(names[i])
                .click(folderClickFn);
        breadcrumbsHtml.push($breadcrumb);
        breadcrumbsHtml.push(" › ");
    }
    breadcrumbsHtml.pop();
    $(".breadcrumbs").html(breadcrumbsHtml);
    
    for(var i = 0; i < elems.length; i++) {
        var $elem = elems[i];
        // we wait until after every role-folder's been added
        // before adding the listeners
        addPillDragFns($elem, $(".role-folder"));
    }
    
    renderMemberPopovers(entries);
    updateNumRolesDisplay(entryManager.numMembers());
};

function renderCurrentFolderPills() {
    var currentFolder = entryManager.getEntryById(entryManager.currentFolderId);
    renderPills(currentFolder, entryManager.getCurrentFolderChildren());
}

//Create the popover for each member. Allows you to edit and delete members. 
function renderMemberPopovers(members) {
    //Loop over each member in the members array 
    var len = members.length;
    for (var i=0;i<len;i++){
        var member = members[i];
        if(member.type === "folder") {
            continue;
        }
        
        //Extract info from members
        var member_id = member.id;
        var member_name = member.role;
        var invitation_link = member.invitation_link;
        var member_type = member.type; 
        
        //Default type is worker
        if(member_type==undefined){
	        member_type = "worker";
        }

        //Create the main content of the popover
        var content = '<form name="memberForm_' + member_id + '>'
        +'<div class="mForm_' + member_id + '">'

        //Member type select menu
        content += 'Member Type: <select name="membertype" id="member' + member_id + '_type">';
        if(member_type == "worker"){
            content += '<option value="worker" selected>Worker</option>';
        } else {
            content += '<option value="worker">Worker</option>';
        }
        if(member_type == "pc"){
            content += '<option value="pc" selected>Team Lead</option>';
        } else {
            content += '<option value="pc">Team Lead</option>';
        }
        if(member_type == "client"){
            content += '<option value="client" selected>Client</option>';
        } else {
            content += '<option value="client">Client</option>';
        }   
        content += '</select><br />';
        
        //Member skills from upwork skill categories
        +'<div class="input-append" > '
        content += '<br><input class="skillInput" id="addSkillInput_' + member_id 
            + '" type="text" data-provide="typeahead" placeholder="Add Upwork Skill" />'
            +'<button class="btn" type="button" class="addSkillButton" id="addSkillButton_' + member_id 
            + '" onclick="addSkill(' + member_id + ');">+</button>'
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

        

        //NEW, ALEXANDRA START HERE
        //content += '<input type="text" value="' + "member.skills" + '" placeholder="Add skill" id="skills" />';
        //$("#skills").tagsinput();

        var newColor = "'"+member.color+"'";

        content += 'Member Color: <input type="text" class="full-spectrum" id="color_' + member_id + '"/>'
        +'<p><script type="text/javascript"> initializeColorPicker(' + newColor +'); </script></p>'

         +'<p><button class="btn btn-primary" type="button" onclick="saveMemberInfo(' + member_id + '); updateStatus();">Save</button>      '
         +'<button class="btn btn-danger" type="button" onclick="confirmDeleteMember(' + member_id + ');">Delete</button>      '
         +'<button class="btn btn-default" type="button" onclick="hideMemberPopover(' + member_id + ');">Cancel</button> <br><br>'
         
        +'<button class="btn btn-default" type="button" onclick="confirmReplaceMember(' + member_id + '); updateStatus();">Replace</button>     <br>'
        + 'Invitation link: <a id="invitation_link_' + member_id + '" onclick="clickedMemInviteLink(' + member_id 
            + ')" href="' + invitation_link + '" target="_blank">'
        + invitation_link
        + '</a>'
        +'</p></form>' 
        +'</div>';
        
        //Create the popover, fill with the content above
        $("#mPill_" + member_id).popover('destroy');
        $("#mPill_" + member_id).popover({
            placement: "right",
            html: "true",
            class: "member",
            id: '"memberPopover' + member_id + '"',
            trigger: "click",
            title: '<div data-pk="' + member_id + '" class="popover-mname">' + member_name 
                + '</div><a href="#" class="edit-mname"><i class="icon-pencil"></i></a>',
            content:  content,
            container: $("#member-container"),
            callback: function(){
                logActivity("renderMemberPopovers(members)",'Clicked Member Pill to Show Popover', 
                    new Date().getTime(), current_user, chat_name, team_id, entryManager.getEntryById(member_id));

               $(".skillInput").each(function () {
                $(this).typeahead({source: oSkills})
            });  
           }
       });
       
        $("#mPill_" + member_id).on('click', generateMemberPillClickHandlerFunction(member_id));
        $("#mPill_" + member_id).off('click', generateMemberPillClickHandlerFunction(member_id));

       
    }

};

// append Upwork Skills input to popover
        $(document).ready(function() {
            pressEnterKeyToSubmit(".skillInput", ".addSkillButton");
        });

function clickedMemInviteLink(mem_id){
    logActivity("clickedMemInviteLink(mem_id)", 'Clicked Member Invite Link', new Date().getTime(), 
        current_user, chat_name, team_id, entryManager.getEntryById(mem_id));
}

function generateMemberPillClickHandlerFunction(mem_id) {
    return function() {
        memberPillClick(mem_id);
    };
}


function memberPillClick(mem_id) {

    logActivity("memberPillClick(mem_id)", 'Clicked Member Pill', new Date().getTime(), 
        current_user, chat_name, team_id, entryManager.getEntryById(mem_id));

    //Close all open popovers
    entryManager.eachMemberId(function(id) {
        if(id != mem_id) {
            $("#mPill_"+id).popover("hide");
        }
    });
    
}


function newFolderObject(folderName, parentId) {
    return {
        name: folderName, parentId: parentId, type: "folder",
        id: generateMemberId(), childIds: [], numMembers: 0};
}

function newMemberObject(memberName) {
    var color = colorBox.grabColor();
    
    return {"role":memberName, "id": generateMemberId(), "color":color, "type": "worker", 
        "skills":[], "seenDocQs": []};
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

    logActivity("addFolder(folderName, parentId)",'Added Folder', new Date().getTime(), 
        current_user, chat_name, team_id, folderObject);
    
    renderCurrentFolderPills();
    updateStatus();

}

/**
 * @param {string|number} id
 */
function deletePopover(id) {
    $("#mPill_" + id).popover("destroy");
}

function closeOpenPopovers() {
    //Close all open popovers
    entryManager.eachMemberId(function(id) {
        $("#mPill_"+id).popover('hide');
    });
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
    var member_obj = newMemberObject(member_name);
    
    entryManager.addEntry(member_obj);
    
    //update event popovers to show the new member
    var events = flashTeamsJSON.events;

    renderCurrentFolderPills();
    logActivity("addMember()",'Added Member', new Date().getTime(), 
    current_user, chat_name, team_id, member_obj);

    updateStatus();
    inviteMember(member_obj.id);
};


//Adds a needed skill to a member and updates JSON
function addSkill(memberId) {
    var skillName = $("#addSkillInput_" + memberId).val();
    if (skillName == "" || oSkills.indexOf(skillName) < 0) {
        alert("Not a valid Upwork skill");
        return;
    }

    //Update JSON
    var member = entryManager.getEntryById(memberId);
    member.skills.push(skillName);
    var memberSkillNumber = member.skills.length;

    logActivity("addSkill(memberId)",('Add Skill - skill name:' + skillName), new Date().getTime(), 
        current_user, chat_name, team_id, member);

    
    $("#skillPills_" + memberId).append('<li class="active" id="sPill_mem' + memberId + '_skill' 
        + memberSkillNumber + '"><a>' + skillName 
        + '<div class="close" onclick="deleteSkill(' + memberId + ', ' + memberSkillNumber + ', &#39' 
        + skillName + '&#39)">  X</div></a></li>');
    $("#addSkillInput_" + memberId).val(this.placeholder);
};

function deleteSkill(memberId, pillId, skillName) {

    logActivity("deleteSkill(memberId, pillId, skillName)",('Delete Skill - skill name:' + skillName), 
        new Date().getTime(), current_user, chat_name, team_id, member);
    //Remove skill pill
    $("#sPill_mem" + memberId + '_skill' + pillId).remove();
    //Update JSON
    var member = entryManager.getEntryById(memberId);
    for (var i = 0; i < member.skills.length; i++) {
        if (member.skills[i] == skillName) {
            member.skills.splice(i, 1);
            break;
        }
    }
};


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
function deleteEntry(entryId) {
    // ensure that entry id is a string before using it to search
    // through event members
    entryId = String(entryId);
    $('#confirmAction').modal('hide');
    var entry = entryManager.getEntryById(entryId);

    logActivity("deleteEntry(entryId)",'Delete Member', new Date().getTime(), 
        current_user, chat_name, team_id, entry);

    if(entryManager.isMember(entry)) {
        // remove from members array with event object
        for(var i=0; i<flashTeamsJSON["events"].length; i++){
            var ev = flashTeamsJSON["events"][i];
            var member_event_index = ev.members.indexOf(entryId);
            // remove member
            if(member_event_index != -1){ // found member in the event
                deleteEventMember(ev.id, entryId);
            }

            //remove dri if the member was a dri
            if (ev.dri == String(entryId)){
                ev.dri = "";
            }
        }
    }
    
    entryManager.removeEntry(entryId);
    
    deletePopover(entryId);
    
    renderCurrentFolderPills();
    updateStatus();
};

//Calling this one
//Saves info and updates popover, no need to update JSON, done by individual item elsewhere
function saveMemberInfo(memberId) {
    var member = entryManager.getEntryById(memberId);

    member.type = document.getElementById("member" + memberId + "_type").value;
    
    var newColor = $("#color_" + memberId).spectrum("get").toHexString();

    updateMemberPillColor(newColor, memberId);
    renderMemberPillColor(memberId);

    $("#mPill_" + memberId).popover("hide");
    renderAllMemberTabs();
    renderMemberPopovers(entryManager.getCurrentFolderChildren());
    flashTeamsJSON['local_update'] = new Date().getTime();
    logActivity("saveMemberInfo(memberId)",'Saved Member Info', new Date().getTime(), 
        current_user, chat_name, team_id, member);
};

//Close the popover on a member to "cancel" the edit
function hideMemberPopover(memberId) {
    logActivity("hideMemberPopover(memberId)",'Closed Member Popover', new Date().getTime(), 
        current_user, chat_name, team_id, entryManager.getEntryById(memberId));
    $("#mPill_" + memberId).popover("hide");
}

function inviteMember(pillId) {
    //var flash_team_id = $("#flash_team_id").val();
    var flash_team_id = team_id == origin_id ? team_id : origin_id;

    var url = '/members/' + flash_team_id + '/invite';
    var member = entryManager.getEntryById(pillId);
    var data = {uniq: member.uniq};
    $.get(url, data, function(data){
        member.uniq = data["uniq"];
        member.invitation_link = data["url"];
        renderMemberPopovers(entryManager.getCurrentFolderChildren());
        updateStatus();
    });
}

function reInviteMember(pillId) {
    $('#confirmAction').modal('hide');
    
    logActivity("reInviteMember(pillId)",'Reinvited Member', new Date().getTime(), 
        current_user, chat_name, team_id, entryManager.getEntryById(pillId));

    //var flash_team_id = $("#flash_team_id").val();
    var flash_team_id = team_id == origin_id ? team_id : origin_id;
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
    alertText.innerHTML = "<b>Are you sure you want to replace " + memberToReplace 
        + "? </b><br><font size = '2'>  The current " 
        + memberToReplace + " will no longer have access to " + flashTeamsJSON["title"] 
        + " and you will need to hire a new " + memberToReplace + ".</font>";

    var deleteButton = document.getElementById("confirmButton");
    deleteButton.innerHTML = "Replace member";

    $('#confirmAction').modal('show');

    //Calls reInviteMember function if user confirms the replace
    document.getElementById("confirmButton").onclick=function(){
        logActivity("confirmReplaceMember(pillId)",'Confirmed Replace Member', new Date().getTime(), 
            current_user, chat_name, team_id, entryManager.getEntryById(pillId));
        reInviteMember(pillId)
    };

}

function renderMemberPillColor(memberId) {
    var color = entryManager.getEntryById(memberId).color;
    
    var pillLi = document.getElementById("mPill_" + memberId);
    pillLi.childNodes[0].style.backgroundColor = color;
};

//Takes the new color, turns into hex and changes background color of a pill list item
function updateMemberPillColor(color, memberId) {
    entryManager.getEntryById(memberId).color = color;
    updateStatus();
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
        palette: colorBox.colors,
        change: function(color) {
            colorToChange = color.toHexString();
        }
    });
}

function generateMemberId() {
    return String((new Date()).getTime());
}

function getMemberById(id) {
    return entryManager.getEntryById(id);
}

function searchById (arr, id) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
            return i;
        }
    }
};

// returns true or false depending on if the current member assigned to task with the groupNum passed in
function currentMemberTask(groupNum){
     if(current_user == undefined) {return;}

    var task_id = getEventJSONIndex(groupNum);
    var eventObj = flashTeamsJSON["events"][task_id];

    var members = eventObj["members"];

    if(members.length == 0){
        //console.log("no members");
        return false;
    }

    for (var i=0; i<members.length; i++) {
        var member_id = members[i];
        if (current_user.id == member_id){
           //console.log("members = true");
           return true;
        }
    }
}

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
    logActivity("updateRoleName(id, newValue)",'Updated Member Role Name', new Date().getTime(), 
        current_user, chat_name, team_id, member);
    flashTeamsJSON['local_update'] = new Date().getTime;
    updateStatus();
    $('#mPill_' + id + ' .name').html(newValue);
}

//Populate the autocomplete function for the event members
//TO BE DELETED, WILL BE CHANGING TO A CHECKBOX SYSTEM
function addMemAuto() {
    var memberArray = [];
    entryManager.eachMemberId(function(id) {
        memberArray.push(entryManager.getEntryById(id).role);
    });
    
    $(".eventMemberInput").each(function() {
        $(this).autocomplete({
            source: memberArray
        });
    })
};
