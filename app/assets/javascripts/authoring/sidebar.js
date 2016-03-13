/***project overview***/

function renderProjectOverview(){

	var project_overview = flashTeamsJSON["projectoverview"];

	showProjectOverview();
}

function showProjectOverview(){
	var project_overview = flashTeamsJSON["projectoverview"];

	if(project_overview === undefined){
		project_overview = "No project overview has been added yet.";
	}

	//uniq_u is null for author, we use this to decide whether to show the edit link next to project overview
	var uniq_u=getParameterByName('uniq');

	if(uniq_u == "" || memberType == "pc" || memberType == "client") {
		$('#projectOverviewEditLink').show();
		$("#projectOverviewEditLink").html('<a onclick="editProjectOverview(false)" style="font-weight: normal;">Edit</a>');
	}

	var projectOverviewContent = '<div id="project-overview-text"><p>' + project_overview + '</p></div>';

	$('#projectOverview').html(projectOverviewContent);

	//modal content
	$('#po-text').html(projectOverviewContent);

	//only allow authors to edit project overview
	if(uniq_u == "" || memberType == "pc" || memberType == "client") {
		$("#edit-save").css('display', '');
		$("#edit-save").attr('onclick', 'editProjectOverview(true)');
		$("#edit-save").html('Edit');
	}
	else{
		$("#edit-save").css('display', 'none');
	}
}

function editProjectOverview(popover){

	var project_overview = flashTeamsJSON["projectoverview"];

	if(project_overview === undefined){
		project_overview = "";
	}

	if(popover==true){
		$('#po-edit-link').hide();

        currentTeam.logActivity("editProjectOverview(true)",'Edit Project Overview - In Modal', flashTeamsJSON);


		var projectOverviewForm = '<form name="projectOverviewForm" id="projectOverviewForm" style="margin-bottom: 5px;">'
					+'<textarea type="text"" id="projectOverviewInput" rows="6" placeholder="Description of project...">'+project_overview+'</textarea>'
					+ '<a onclick="showProjectOverview()" style="font-weight: normal;">Cancel</a>'
					+'</form>';
		$('#po-text').html(projectOverviewForm);

		$("#edit-save").attr('onclick', 'saveProjectOverview()');
		$("#edit-save").html('Save');
	}

	else{
		$('#projectOverviewEditLink').hide();

		var projectOverviewForm = '<form name="projectOverviewForm" id="projectOverviewForm" style="margin-bottom: 5px;">'
				+'<textarea type="text"" id="projectOverviewInput" rows="6" placeholder="Description of project...">'+project_overview+'</textarea>'
				+ '<button class="btn btn-default" type="button" onclick="showProjectOverview()">Cancel</button>'
				+ '<button class="btn btn-success" type="button" onclick="saveProjectOverview()" style="float: right;">Save</button>'
				+'</form>';

		$('#projectOverview').html(projectOverviewForm);
	}

}


function saveProjectOverview(){

	// retrieve project overview from form
    var project_overview_input = $("#projectOverviewInput").val();

    		if (project_overview_input === "") {
        		project_overview_input =  "No project overview has been added yet.";
		}

    currentTeam.logActivity('saveProjectOverview()',"saveProjectOverview() - Before Update",'Save Project Overview - Before Update', flashTeamsJSON);


    flashTeamsJSON["projectoverview"] = project_overview_input;

    updateStatus();


    showProjectOverview();
}

function logSidebarClick(containerName){
    currentTeam.logActivity("logSidebarClick('containerName')",'Clicked on Sidebar Container Element: ' + containerName, flashTeamsJSON);
}


/***chat****/


// A helper function to let us set our own status
function setUserStatus(status) {
	// Set our status in the list of online users.
	currentStatus = status;
    statusTimestamp = new Date().getTime();
	if (chat_name != undefined && status != undefined && chat_role != undefined){
        //console.log("name: " + name);
		myUserRef.set({ name: chat_name, status: status, role: chat_role, timestamp: statusTimestamp, chat_uniq: chat_uniq });
	}
}




// Use idle/away/back events created by idle.js to update our status information.
$(function() {

});
/***chat end****/


//*************status bar begin *******//

/* --------------- PROJECT STATUS BAR START ------------ */


// var project_status_svg = d3.select("#status-bar-container").append("svg")
// .attr("width", "100%")
// .attr("height", 100)
// .text("");

// var statusText = project_status_svg.append("foreignObject")
// .attr("x", 11)
// .attr("y", 15)
// .attr("width", "90%")
// .attr("height", 100)
// .append("xhtml:p")
// .style("color", "blue")
// .style("font-size", "16px")
// .style("background-color", "#ffffff")
// .style("width", "90%")
// .text("");

// var project_status_svg = d3.select("#project-status-text").append("svg")
// .attr("width", "100%")
// .attr("height", 100)
// .text("");

// var statusText = project_status_svg.append("foreignObject")
// .attr("x", 0)
// .attr("y", 0)
// .attr("width", "100%")
// .attr("height", 100)
// .append("xhtml:p")
// .style("color", "blue")
// .style("font-size", "16px")
// .style("background-color", "#ffffff")
// .style("width", "100%")
// .text("");



var status_width=100;
var status_height=32;
var status_x=0;
var status_y=25;
var curr_status_width=0;
var project_duration=1440000;
var status_bar_timeline_interval=1000;  //TODO back to 10 secs //start moving each second for the width of project_status_interval_width.
var num_intervals;                      //=(parseFloat(project_duration)/parseFloat(status_bar_timeline_interval));
var project_status_interval_width;      //=parseFloat(status_width)/parseFloat(num_intervals);
var thirty_min= 10000; //TODO normal speed timer is 1800000; fast timer is 10000
var first_move_status=1;

// var gdrive_link = project_status_svg.append("text")
//         .text("Google Drive Folder")
//         .attr("style", "cursor:pointer; text-decoration:underline; text-decoration:bold;")
//         .attr("class", "gdrive_link")
//         .attr("id", function(d) {return "folderLink";})
//         // .attr("groupNum", groupNum)
//         .attr("x", function(d) {return status_x})
//         .attr("y", function(d) {return status_y + 10})
//         .attr("font-size", "12px");

// $("#folderLink").on('click', function(){
//     window.open(flashTeamsJSON.folder[1]);
// });

/*var project_status_svg = d3.select("#status-bar-container").append("svg")
    .attr("width", SVG_WIDTH)
    .attr("height", 50)


project_status_svg.append("rect")
    .attr("width", status_width)
    .attr("height", status_height)
    .attr("x",status_x)
    .attr("y",status_y)
    .style("stroke","black" )
    .attr("fill","white")

var project_status=project_status_svg.append("rect")
    .attr("width", curr_status_width)
    .attr("height", status_height)
    .attr("x",status_x)
    .attr("y",status_y)
    .attr("fill","green")
    .attr("class","project_status")

$(document).ready(function(){
  $("#flip").click(function(){
    $("#panel").slideToggle();
  });
});
*/
var moveProjectStatus = function(status_bar_timeline_interval){
    var me = $('.progress .bar');
    var perc = 100;

    var current_perc = 0;

    var progress = setInterval(function() {
        if(curr_status_width<status_width && delayed_tasks.length==0){
            curr_status_width += project_status_interval_width;

        }
        if(curr_status_width>status_width){
            curr_status_width = status_width;
        }
        me.css('width', (curr_status_width)+'%');
    },status_bar_timeline_interval);

    return progress;
};

var stopProjectStatus = function(){
    var me = $('.progress .bar');
    me.css('width', curr_status_width+'%');
    window.clearInterval(project_status_handler);
};

// function init_statusBar(status_bar_timeline_interval){
//     var last_group_num=-1;
//     var last_end_x=0;

//     for (var i=0;i<task_groups.length;i++){
//         var data = task_groups[i];
//         var groupNum = data.groupNum;

//         var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
//         var start_x = ev.x+4;  //CHECK with Jay
//         var width = getWidth(ev);
//         var end_x = parseFloat(start_x) + parseFloat(width);

//         if(last_end_x<end_x){
//             last_end_x=end_x;
//         }

//     }
//    // last_end_x=parseFloat(last_end_x)/50*thirty_min; //TODO change to width
//    //console.log("last_end",last_end_x);
//    project_duration=parseInt(last_end_x/50)*thirty_min;
//    //console.log("project duration: ",project_duration);

//    num_intervals=(parseFloat(project_duration)/parseFloat(status_bar_timeline_interval));
//    project_status_interval_width=parseFloat(status_width)/parseFloat(num_intervals);
// }


// function load_statusBar(status_bar_timeline_interval){

//     //pause if a task is delayed
//     if(delayed_tasks.length != 0){

//         var start_delayed_x;  //CHECK with Jay
//         var width_delayed;
//         var end_delayed_x;

//         for (var i = 0; i<task_groups.length; i++){
//             var data = task_groups[i];
//             var groupNum = data.groupNum;


//             if (groupNum == delayed_tasks[0]){

//                 start_delayed_x = data.x+4;  //CHECK with Jay
//                 var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
//                 width_delayed = getWidth(ev);
//                 end_delayed_x = parseFloat(start_delayed_x) + parseFloat(width_delayed);


//                 break;
//             }
//         }

//         var last_group_num=-1;
//         var last_end_x=0;

//         for (var i=0;i<task_groups.length;i++){
//             var data = task_groups[i];
//             var groupNum = data.groupNum;

//             var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];

//             var start_x = ev.x+4;  //CHECK with Jay
//             var width = getWidth(ev);
//             var end_x = parseFloat(start_x) + parseFloat(width);

//             if(last_end_x<end_x){
//                 last_end_x=end_x;
//             }

//         }

//         // last_end_x=parseFloat(last_end_x)/50*thirty_min; //TODO change to width
//         //console.log("last_end",last_end_x);
//         var cursor_x = cursor.attr("x1");
//         project_duration=parseInt((last_end_x)/50)*thirty_min;
//         //console.log("project duration: ",project_duration);

//         num_intervals=(parseFloat(project_duration)/parseFloat(status_bar_timeline_interval));
//         project_status_interval_width=parseFloat(status_width)/parseFloat(num_intervals);


//         curr_status_width = status_width * parseFloat(end_delayed_x)/parseFloat(last_end_x);

//         return;
//     }

//     if (flashTeamsJSON["startTime"] == null ){
//         return;
//     }

//     var currTime = (new Date).getTime();

//     var startTime = flashTeamsJSON["startTime"];
//     var diff = currTime - startTime;
//     var diff_sec = diff/1000;


//     var last_group_num=-1;
//     var last_end_x=0;

//     for (var i=0;i<task_groups.length;i++){
//         var data = task_groups[i];
//         var groupNum = data.groupNum;

//         var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
//         var start_x = ev.x+4;  //CHECK with Jay
//         var width = getWidth(ev);
//         var end_x = parseFloat(start_x) + parseFloat(width);

//         if(last_end_x<end_x){
//             last_end_x=end_x;
//         }
//     }

//    // last_end_x=parseFloat(last_end_x)/50*thirty_min; //TODO change to width
//    //console.log("last_end",last_end_x);
//    project_duration=parseInt(last_end_x/50)*thirty_min;
//    //console.log("project duration: ",project_duration);

//    num_intervals=(parseFloat(project_duration)/parseFloat(status_bar_timeline_interval));
//    project_status_interval_width=parseFloat(status_width)/parseFloat(num_intervals);

//    curr_status_width = project_status_interval_width * diff_sec;
// }
var status_interval_id;

var setProjectStatusMoving = function(){
    return moveProjectStatus(status_bar_timeline_interval);
};

/* --------------- PROJECT STATUS BAR END ------------ */
