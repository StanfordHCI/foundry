elemId = null;
isWorkerTask = function(eventObj) {
	return current_user && eventObj.members.indexOf(current_user.id) > - 1;
}


$("#tourBtn2").click(function(){
	//Initialize the tour
	console.log("make sure this works");
	for (i = 0; i < flashTeamsJSON["events"].length; i++){
    	if (isWorkerTask(flashTeamsJSON["events"][i])){
    		elemId = i+1;
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
		title: "<b>Customize the Events</b>",
		content: "<div class='tour-content-wrapper'>Add details to each event so workers "
		+"can easily complete their tasks. Add a title, assign workers, specify inputs and ouputs "
		+"of the task, write a description, and specify questions for task documentation."
		+"<img src='/assets/editTask.gif'> </img></div>"
		+"<nav class='popover-navigation'><div class='btn-group'>"
		+"<button class='btn btn-default' data-role='prev'>« Prev</button>"
		+"<button class='btn btn-default' data-role='next'>Next »</button></div>"
		+"<button class='btn btn-default' data-role='end'>End tour</button></nav></div>",
		template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3>"
		+"<div class='popover-content'></div>"
	},
	{	element: "#g_" + elemId,
		title: "<b>Welcome to Foundry</b>",
		// backdrop: true,
		html: true,
		content: "Hello there"
	}
	]
	});
	eventTour.init();
    eventTour.start(true);
    // eventTour.goTo(0); //Always start tour at the first step
});


