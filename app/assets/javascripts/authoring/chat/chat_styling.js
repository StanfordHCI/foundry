function chatResize() {
  var messageList = $("#messageList");
  var header = $("#right-sidebar .header.chat-header");
  var entry = $("#right-sidebar .entry");
  var rightSidebarHeight = $("#right-sidebar").outerHeight();
  
  var h = rightSidebarHeight - header.outerHeight() - entry.outerHeight();
  
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
      logActivity("$('#show-online-button').click(function(e)",'Clicked See Who is Online - To Show', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
      onlineUsers.css({
          top: $('.chat-header').outerHeight(),
          height: rightSidebarHeight - headerHeight,
      }).show();
  } else {
      logActivity("$('#show-online-button').click(function(e)",'Clicked See Who is Online - To Hide', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
      onlineUsers.hide();
  }
});