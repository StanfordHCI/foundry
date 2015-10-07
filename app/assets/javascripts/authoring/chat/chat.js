Chat = function() {
  this.getUserData = function() {
    var uniq_u=getParameterByName('uniq');

    var url2 = '/flash_teams/' + flash_team_id + '/get_user_name';
    $.ajax({
       url: url2,
       type: 'post',
       data : { "uniq" : String(uniq_u) }
    }).done(function(data){
      this.setCurrentUser(data);
      // Set our initial online status.
      this.setUserStatus("online ★");

      this.draw(data);
    }
  }

// A helper function to let us set our own status
  this.setUserStatus = function(data, status) {
    var chat_name = data["user_name"];
    var chat_role = data["user_role"];
    // Set our status in the list of online users.
    currentStatus = status;
    statusTimestamp = new Date().getTime();
    if (chat_name != undefined && status != undefined && chat_role != undefined){
      myUserRef.set({ name: chat_name, status: status, role: chat_role, timestamp: statusTimestamp, chat_uniq: "author" });
    }
  }


  this.setCurrentUser = function(data) {
    var chat_role = data["user_role"];

    presname = chat_name;

    var flashTeamsJSON = this;

    // current_user is undefined for author so just set it to 'Author'
    // when current_user is the author it won't have a uniq id so need to check for current_user == 'Author' instead
    if(chat_role == 'Author'){
      current_user = 'Author';
      //console.log ("CURRENT USER AUTHOR: " + current_user);
    }
    if (chat_role == "" || chat_role == null){
      uniq_u2 = data["uniq"];

      var flash_team_members = flashTeamsJSON["members"];
      for(var i=0;i<flash_team_members.length;i++){
        if (flash_team_members[i].uniq == uniq_u2){
          chat_role = flash_team_members[i].role;
          current = i;
          current_user = flash_team_members[i];

          // here there once existed a call to boldEvents
          trackUpcomingEvent();
        }
      }
    }
  }

  this.draw = function(data) {
    myDataRef.on('child_added', function(snapshot) {
      var message = snapshot.val();
      displayChatMessage(message.name, message.uniq, message.role, message.date, message.text);

      name = message.name;
    });
  }

  //============== separate model? ======================//
  this.displayChatMessage = function(name, uniq, role, date, text) {

      if(name == undefined){
          return;
      }

      var message_date = new Date(date);
      var dateform = message_date.toLocaleString();

      // diff in milliseconds
      var diff = Math.abs(new Date() - message_date);

      //notification title
      var notif_title = name+': '+ text;

      //notification body
      var notif_body = dateform;

      // true if the message was sent by the current user
      var is_current_user_message = (current_user == 'Author' && role == 'Author') ||
                                    (current_user.uniq == uniq);

      var showchatnotif = !is_current_user_message; // true if notifications should be shown

      // checks if last notification was less than 5 seconds ago
      // this is used to only create notifications for messages that were sent from the time you logged in and forward
      // (e.g., no notifications for messages in the past)
      if (diff <= 50000 && showchatnotif == true){
          playSound("/assets/notify");
        notifyMe(notif_title, notif_body, 'chat');
      }

    //revise condition to include OR if timestamp of last message (e.g., lastDate) was over 10 minutes ago
      if(lastWriter!=name){
          lastMessage = (lastMessage+1)%2 + diff;

          var dateDiv = $('<div/>').addClass("date").text(dateform);
          var authorDiv = $('<div/>').addClass("author-header").text(name + ' (' + role + ')');
          var textDiv = $('<div/>', {"id": "m"+lastMessage, user: chat_name}).addClass("text").text(text);

          var wrapperDiv = $('<div/>').addClass('message');

          var clearDiv = $('<div class="clear"></div>');

          if(is_current_user_message) {
            wrapperDiv.addClass('by-user');
          }

          dateDiv.addClass('m'+lastMessage);

          wrapperDiv
            .append(authorDiv)
            .append(textDiv)
            .append(clearDiv.clone());

          var messageFooterDiv = $('<div/>').addClass('message-footer');
          messageFooterDiv
            .append(authorDiv.clone().addClass('author')
                      .removeClass('author-header'))
            .append(dateDiv);

          wrapperDiv
            .append(messageFooterDiv)
            .append(clearDiv.clone());

          wrapperDiv.appendTo($('#messageList'));

      } else{
          var textP = $('<p/>').text(text);

          textP.appendTo($('#messageList div[user="' + chat_name + '"]').last());

          $('.date.m' + lastMessage).text(dateform);
      }

      lastWriter = name;
      $('#messageList')[0].scrollTop = $('#messageList')[0].scrollHeight;
  };

  //renderChatbox
  this.render = function(){
    this.getUserData();
  }


}

Chat.create = function(parent) {
  var c = new Chat();
  c.prototype = parent;
  return c;
}
