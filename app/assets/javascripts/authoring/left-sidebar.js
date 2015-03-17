/* left-sidebar.js
 * ---------------
 * This file sets up interaction with the left-sidebar
 */

$(document).ready(function() {
  var menuButton = $("#foundry-header .menu-button");
  var leftSidebar = $("#left-sidebar");
  var timelineWrapper = $("#timeline-wrapper");
  
  // initialize tooltips
  $('.sidebar-button[data-toggle="tooltip"]').tooltip();
  
  // hover listeners
  menuButton.mouseenter(function() {
    // if the menu"s already extended, ignore
    if($(this).hasClass("active")) return;
    
    var peekWidth = 20;
    leftSidebar.css("left", -(leftSidebar.width() - peekWidth) + "px");
    timelineWrapper.css("left", peekWidth + "px");
  });
  
  menuButton.mouseleave(function() {
    // if the menu"s already extended, ignore
    if($(this).hasClass("active")) return;
    
    leftSidebar.css("left", -leftSidebar.width() + "px");
    timelineWrapper.css("left", 0);
  });
  
  // click listener for menu button
  menuButton.click(function() {
    var sidebarWidth = leftSidebar.width();
    if($(this).hasClass("active")) {
    
      leftSidebar.css("left", -leftSidebar.width() + "px");
      var width = timelineWrapper.width() + sidebarWidth;
      timelineWrapper.css({
          left: 0,
          width: width + "px",
      });
      $(this).removeClass("active");
      leftSidebar.removeClass("active");
    } else {
      leftSidebar.css("left", 0);
      var width = timelineWrapper.width()
                - leftSidebar.width();
      
      timelineWrapper.css({
          left: leftSidebar.width() + "px",
          width: width + "px",
      });
      $(this).addClass("active");
      leftSidebar.addClass("active");
    }
  });
  
  // click listener for sidebar menu items
  leftSidebar.find(".sidebar-item .header").click(function(e) {
    $(this).parent().find('.inner').slideToggle(function() {
      $(this).parent().toggleClass('active');
    });
  });
  
  leftSidebar.find('.sidebar-button').click(function() {
    var $this = $(this);
    var inner = leftSidebar.find('> .inner');
    var forSelector = '.' + $this.attr('for');
    if(!forSelector) { return; }
    
    if($this.hasClass('active')) {
      inner.hide();
      $this.removeClass('active');
    } else {
      // de-activate any currently active buttons
      $this.parent().find('.active').removeClass('active');
      inner.show();
      $this.addClass('active');
    }
  });
});