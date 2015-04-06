/* eventTour.js
------------------------------------------------------------------------------------
* References Bootstrap's Tour API to create the tour that is seen initially by workers
* accessing Foundry for the first time.
* Note: Written by Tulsee Doshi
*/

elemId = null;  //The ID of the worker's first task. Is initially set to null
prevElem = null; //The ID of the task before the worker's first task. Is initially set to null

//Determines if a particular event belongs to the "current user"
isWorkerTask = function(eventObj) {
	return current_user && eventObj.members.indexOf(current_user.id) > - 1;
}

//when the window loads for the first time, initializes and then runs the tour
window.onload = function(){
	//Initialize the tour

	//Only initializes and runs the event, if there is no cookie already in the system 
	//(ie. if a user has never been to the page before)
	if (!$.cookie('first')){
		pOverview = flashTeamsJSON['projectoverview'];

		//Edge case for if there is no project description
		if (!pOverview){
			pOverview = "<b>This project has no project description</b>";
		}
		
		//Iterates through events, and stops  once it finds one that belongs to the worker
		for (i = 0; i < flashTeamsJSON["events"].length; i++){
	    	if (isWorkerTask(flashTeamsJSON["events"][i])){
	    		elemId = flashTeamsJSON["events"][i]["id"];
	    		if(i > 0){
	    			prevElem = flashTeamsJSON["events"][i-1]["id"]
	    		}
	    		break;
	    	}
	    }

	    //If the worker is assigned an event, initializes the tour
	    if (elemId){
		    var eventTour = new Tour({
			autoscroll: true,
			steps: [
			{//The first step in the tour: Project Description
				orphan: true,
				title: "<b>Welcome to Foundry!</b>",
				content: "<div class='tour-content-wrapper'>Welcome to Foundry. "
				+"We're here to help you get started!</br>"
				+ "Read the Project Description below, and follow the next few steps"
				+" in order to start your project."
				+ "<hr></hr>" 
				+ pOverview
				+"</div>"
				+"<nav class='popover-navigation'><div class='btn-group'>"
				+"<button class='btn btn-default' data-role='prev' disabled='true'>« Prev</button>"
				+"<button class='btn btn-default' data-role='next'>Next »</button></div>"
				+"<button class='btn btn-default' data-role='end'>End tour</button></nav></div>",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3>"
				+"<div class='popover-content'></div>"
			},
			{	//Step 2 in the tour: Previous Event, if it exists
				element: "#g_" + prevElem,
				title: "<b>The Previous Task</b>",
				html: true,
				content: "This is the task right before yours."
				+ " Before working, <b>click on the task</b> to read about the"
				+ " details of the task, and the documentation information"
				+ " that the previous worker has left for you."
				+ "</br></br>Pay close attention to the tasks that have handoffs (arrows) leading into your task."
			},
			{	//Step 3 in the tour: Current Event, if it exists
				element: "#g_" + elemId,
				title: "<b>Your Task</b>",
				html: true,
				content: "This is <b>YOUR</b> task. You can now end this tour, "
				+"and <br/><b>click on the task rectangle and click start </b>"
				+ " to read about your task, and start tracking work time. Note that time for "
				+"reviewing the previous materials, etc. are accounted for as work time.</br></br>"
				+ "Pay close attention to the task description, the 'inputs' "
				+"(what other workers have handed off to you)" 
				+ ", and the deliverables you are expected to create."
				+"<nav class='popover-navigation'><div class='btn-group'>"
				+"<button class='btn btn-default' data-role='prev'>« Prev</button>"
				+"<button class='btn btn-default' data-role='next' disabled='true' >Next »</button></div>"
				+"<button class='btn btn-default' data-role='end'>End tour</button></nav>",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3>"
				+"<div class='popover-content'></div>"
			}
			]
			});

			//Runs the event tour
			eventTour.init();
		    eventTour.start(true);
		    eventTour.goTo(0); //Always start tour at the first step
		    $.cookie('first','1',{expires: 1});
		}
	} else {
		//console.log("YAY COOKIE");
	}
};



