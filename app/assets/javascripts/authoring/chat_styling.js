function chatResize() {
  var messageList = $("#messageList");
  var header = $("#right-sidebar .header.chat-header");
  var entry = $("#right-sidebar .entry");
  var rightSidebarHeight = $("#right-sidebar").outerHeight();
  
  var h = rightSidebarHeight - header.outerHeight() - entry.outerHeight();
  
  messageList.css({
    height: h + "px",
  });
  
  var onlineUsers = $('#online-users-box');
  onlineUsers.css({
    top: $('.chat-header').outerHeight(),
    height: rightSidebarHeight - headerHeight,
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
    // chatContent.addClass('blurred');
  } else {
    onlineUsers.hide();
    // chatContent.removeClass('blurred');
  }
});