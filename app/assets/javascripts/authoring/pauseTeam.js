$("#flashTeamPauseBtn").click(function(){
    
 	var bodyText = document.getElementById("confirmActionText");
    //updateStatus();
    bodyText.innerHTML = "Are you sure you want to edit the team?";
    
    var confirmStartTeamBtn = document.getElementById("confirmButton");
    confirmStartTeamBtn.innerHTML = "Edit";
    
    $("#confirmButton").attr("class","btn btn-success");
    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "Edit Team?";
    $('#confirmAction').modal('show');

    document.getElementById("confirmButton").onclick=function(){pauseFlashTeam()};    


});

function pauseFlashTeam(){
	$('#confirmAction').modal('hide');

	$("#flashTeamPauseBtn").css('display', 'none');
    $("#flashTeamResumeBtn").css('display', '');
 
	flashTeamsJSON["paused"]=true;
	updateStatus();

}


$("#flashTeamResumeBtn").click(function(){
    
 	var bodyText = document.getElementById("confirmActionText");
    //updateStatus();
    bodyText.innerHTML = "Are you sure you want to resume the team?";
    
    var confirmStartTeamBtn = document.getElementById("confirmButton");
    confirmStartTeamBtn.innerHTML = "Resume";
    
    $("#confirmButton").attr("class","btn btn-success");
    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "Resume Team?";
    $('#confirmAction').modal('show');

    document.getElementById("confirmButton").onclick=function(){resumeFlashTeam()};    


});

function resumeFlashTeam(){
	$('#confirmAction').modal('hide');

	$("#flashTeamPauseBtn").css('display', '');
    $("#flashTeamResumeBtn").css('display', 'none');
 
	flashTeamsJSON["paused"]=false;
	updateStatus();
	
}