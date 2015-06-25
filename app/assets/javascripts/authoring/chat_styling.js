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

  //Show the list of users and their status on top of the chat
  if(!onlineUsers.is(':visible')) {
      logActivity("$('#show-online-button').click(function(e)",'Clicked See Who is Online - To Show', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
      onlineUsers.css({
          top: $('.chat-header').outerHeight(),
          height: rightSidebarHeight - headerHeight
      }).show();
      document.getElementById("show-online-button").innerHTML = "See Chat";
  //Hide the user list
  } else {
      logActivity("$('#show-online-button').click(function(e)",'Clicked See Who is Online - To Hide', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
      onlineUsers.hide();
      document.getElementById("show-online-button").innerHTML = "See who is online (<span class='num-online'>0</span>)";
  
      var numOnlineElem = $(".num-online");
      var numOnline = $("#presenceDiv").children().length;
    numOnlineElem.text(numOnline);

  }
});

//Bold the show online text on hover
$("#show-online-button").mouseover(function() {
  $("#show-online-button").css("font-weight", "bold");
});
$("#show-online-button").mouseout(function() {
  $("#show-online-button").css("font-weight", "normal");
});



