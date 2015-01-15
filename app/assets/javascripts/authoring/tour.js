/* tour.js
 * ---------------------------------------------
 * 
 * 
 */

//A tour that walks a user through the team authoring process
$(function() {
	var authoringTour = new Tour();
	authoringTour.addStep({
		orphan: true
		 title: "Title of my step",
		 content: "Content of my step"
	});

	//Initialize the tour
	authoringTour.init(); 
	authoringTour.start(true);

});
/*$("#tourBtn").click(function(){
    authoringTour.start(true);
    authoringTour.goTo(0); //Always start tour at the first step
});*/



