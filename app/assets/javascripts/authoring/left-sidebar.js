/* left-sidebar.js
 * ---------------
 * This file sets up interaction with the left-sidebar
 */

$(document).ready(function() {
  var menuButton = $("#foundry-header .menu-button");
  var leftSidebar = $("#left-sidebar");
  var timelineContainer = $("#timeline-container");
  
  // hover listeners
  menuButton.mouseenter(function() {
    // if the menu"s already extended, ignore
    if($(this).hasClass("active")) return;
    
    leftSidebar.css("left", -(leftSidebar.width() - 20) + "px");
    timelineContainer.css("left", "20px");
  });
  
  menuButton.mouseleave(function() {
    // if the menu"s already extended, ignore
    if($(this).hasClass("active")) return;
    
    leftSidebar.css("left", -leftSidebar.width() + "px");
    timelineContainer.css("left", 0);
  });
  
  // click listener
  menuButton.click(function() {
    var margin = 2 * parseFloat(timelineContainer.css("margin-left"));
    if($(this).hasClass("active")) {
      leftSidebar.css("left", -leftSidebar.width() + "px");
      var width = window.innerWidth
                - margin;
      timelineContainer.css({
          left: 0,
          width: width + "px",
      });
      $(this).removeClass("active");
    } else {
      leftSidebar.css("left", 0);
      var width = window.innerWidth
                - leftSidebar.width()
                - margin;
                
      timelineContainer.css({
          left: leftSidebar.width() + "px",
          width: width + "px",
      });
      $(this).addClass("active");
    }
  });
});