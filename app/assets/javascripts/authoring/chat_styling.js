function chatResize() {
  var messageList = $("#messageList");
  var header = $("#right-sidebar .tab-links");
  var entry = $("#right-sidebar .entry");
  var rightSidebarHeight = $("#right-sidebar").outerHeight();
  
  var h = rightSidebarHeight - header.outerHeight() - entry.outerHeight() -20;
  
  messageList.css({
      height: h + "px",
  });
}

// button to show who's online
$('#show-online-button').click(function(e) {
  var onlineUsers = $('#online-users-box');
  var headerHeight = $('.chat-header').outerHeight();
  var rightSidebarHeight = $('#right-sidebar').outerHeight();
  var chatContent = $('#right-sidebar .chat-content');

  if(!onlineUsers.is(':visible')) {
      onlineUsers.css({
          top: $('.chat-header').outerHeight(),
          height: rightSidebarHeight - headerHeight,
      }).show();
  } else {
      onlineUsers.hide();
  }
});

$(document).ready(function() {
    $('.tabs .tab-links a').on('click', function(e)  {
        var currentAttrValue = $(this).attr('href');
 
        // Show/Hide Tabs
        $('.tabs ' + currentAttrValue).show().siblings().hide();
 
        // Change/remove current tab to active
        $(this).parent('li').addClass('active').siblings().removeClass('active');
 
        e.preventDefault();
    });
});