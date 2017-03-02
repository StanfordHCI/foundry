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

    //logActivity("showProjectOverview()",'Show Project Overview', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);

	
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

        logActivity("editProjectOverview(true)",'Edit Project Overview - In Modal', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);

		
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

    logActivity('saveProjectOverview()',"saveProjectOverview() - Before Update",'Save Project Overview - Before Update', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);

	 
    flashTeamsJSON["projectoverview"] = project_overview_input;
        
    updateStatus();

    //logActivity('saveProjectOverview()', "saveProjectOverview() - After Update",'Save Project Overview - After Update', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
    
    showProjectOverview();
}

function logSidebarClick(containerName){
    logActivity("logSidebarClick('containerName')",'Clicked on Sidebar Container Element: ' + containerName, new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
}

//*************status bar begin *******//

/* --------------- PROJECT STATUS BAR START ------------ */

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

var status_interval_id;

var setProjectStatusMoving = function(){
    return moveProjectStatus(status_bar_timeline_interval);
};

/* --------------- PROJECT STATUS BAR END ------------ */
