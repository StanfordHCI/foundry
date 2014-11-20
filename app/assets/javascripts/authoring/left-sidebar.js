/* left-sidebar.js
 * ---------------
 * This file sets up interaction with the left-sidebar
 */

$(document).ready(function() {
  var menuButton = $("#foundry-header .menu-button");
  var leftSidebar = $("#left-sidebar");
  var timelineWrapper = $("#timeline-wrapper");
  
  // hover listeners
  menuButton.mouseenter(function() {
    // if the menu"s already extended, ignore
    if($(this).hasClass("active")) return;
    
    leftSidebar.css("left", -(leftSidebar.width() - 20) + "px");
    timelineWrapper.css("left", "20px");
  });
  
  menuButton.mouseleave(function() {
    // if the menu"s already extended, ignore
    if($(this).hasClass("active")) return;
    
    leftSidebar.css("left", -leftSidebar.width() + "px");
    timelineWrapper.css("left", 0);
  });
  
  // click listener
  menuButton.click(function() {
    // var margin = 2 * parseFloat(timelineWrapper.css("margin-left"));
    var sidebarWidth = leftSidebar.width();
    if($(this).hasClass("active")) {
    
      leftSidebar.css("left", -leftSidebar.width() + "px");
      var width = timelineWrapper.width() + sidebarWidth;
      timelineWrapper.css({
          left: 0,
          width: width + "px",
      });
      $(this).removeClass("active");
    } else {
      leftSidebar.css("left", 0);
      var width = timelineWrapper.width()
                - leftSidebar.width();
                // - margin;
      
      timelineWrapper.css({
          left: leftSidebar.width() + "px",
          width: width + "px",
      });
      $(this).addClass("active");
    }
  });
});