/* left-sidebar.js
 * ---------------
 * This file sets up interaction with the left-sidebar
 */

$(document).ready(function() {
  var menuButton = $('#foundry-header .menu-button');
  var leftSidebar = $('#left-sidebar');
  var timelineContainer = $('#timeline-container');
  
  // hover listeners
  menuButton.mouseenter(function() {
    // if the menu's already extended, ignore
    if($(this).hasClass('active')) return;
    
    leftSidebar.css('left', -(leftSidebar.width() - 20) + 'px');
  });
  
  menuButton.mouseleave(function() {
    // if the menu's already extended, ignore
    if($(this).hasClass('active')) return;
    
    leftSidebar.css('left', -leftSidebar.width() + 'px');
  });
  
  // click listener
  menuButton.click(function() {
    if($(this).hasClass('active')) {
      leftSidebar.css('left', -leftSidebar.width() + 'px');
      $(this).removeClass('active');
    } else {
      leftSidebar.css('left', 0);
      $(this).addClass('active');
    }
  });
});