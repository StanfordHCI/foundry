elemId = null;
isWorkerTask = function(eventObj) {
	return current_user && eventObj.members.indexOf(current_user.id) > - 1;
}


window.onload = function(){
	//Initialize the tour
	if (!$.cookie('first')){
		pOverview = flashTeamsJSON['projectoverview']
		if (!pOverview){
			pOverview = "<b>This project has no project description</b>"
		}
		for (i = 0; i < flashTeamsJSON["events"].length; i++){
	    	if (isWorkerTask(flashTeamsJSON["events"][i])){
	    		elemId = flashTeamsJSON["events"][i]["id"];
	    		if(i > 0){
	    			prevElem = flashTeamsJSON["events"][i-1]["id"]
	    		}
	    		console.log(elemId);
	    		break;
	    	}
	    }
	    var eventTour = new Tour({
		autoscroll: true,
		steps: [
		// {	orphan: true, 
		{
			orphan: true,
			title: "<b>Welcome to Foundry!</b>",
			// content: flashTeamsJSON['projectoverview'],
			content: "<div class='tour-content-wrapper'>Welcome to Foundry. We're here to help you get started!</br>"
			+ "Read the Project Description below, and follow the next few steps in order to start your project."
			+ "<hr></hr>" 
			+ pOverview
			+"</div>"
			+"<nav class='popover-navigation'><div class='btn-group'>"
			+"<button class='btn btn-default' data-role='next'>Next »</button></div>"
			+"<button class='btn btn-default' data-role='end'>End tour</button></nav></div>",
			template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3>"
			+"<div class='popover-content'></div>"
		},
		{	element: "#g_" + prevElem,
			title: "<b>The Previous Task</b>",
			// backdrop: true,
			html: true,
			content: "This is the task right before yours."
			+ " <b>Click on the task</b> to read about the details of the task, and the documentation information"
			+ " that the previous worker has left for you."
		},
		{	element: "#g_" + elemId,
			title: "<b>Your Task</b>",
			// backdrop: true,
			html: true,
			content: "This is <b>YOUR</b> task. You can now end this tour, and <br/><b>click on the task rectangle</b>"
			+ " to read about your task, and get started.</br></br>"
			+ "Pay close attention to the task description, the 'inputs' (what other workers have handed off to you)" 
			+ ", and the deliverables you are expected to create"
		}
		]
		});
		eventTour.init();
	    eventTour.start(true);
	    eventTour.goTo(0); //Always start tour at the first step
	    $.cookie('first','1',{expires: 1});
	}
	else{
		console.log("YAY COOKIE");
	}
};



