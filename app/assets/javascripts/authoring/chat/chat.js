Chat = function() {
  var self = this;
  this.getUserData = function() {
    var uniq_u=getParameterByName('uniq');

    var url2 = '/flash_teams/' + flash_team_id + '/get_user_name';
    $.ajax({
       url: url2,
       type: 'post',
       data : { "uniq" : String(uniq_u) }
    }).done(function(data){
      self.setCurrentUser(data);
      // Set our initial online status.
      self.setUserStatus("online ★");
      self.initHandlers();
      self.initTimer();
      self.draw(data);
    })
  }

  this.initTimer = function() {
    // when user is inactive for 60 seconds
    var awayCallback = function() {
      self.setUserStatus("away");
    };

    var awayBackCallback = function() {
      self.setUserStatus("online ★");
    };

    //when user is looking at another tab
    var hiddenCallback = function() {
      //☆ idle
      self.setUserStatus("idle ☆");
    };

    var visibleCallback = function(){
      self.setUserStatus("online ★");
    };

    var idle = new Idle({
      onHidden: hiddenCallback,
      onVisible: visibleCallback,
      onAway: awayCallback,
      onAwayBack: awayBackCallback,
      awayTimeout: 60000 //away with 1 minute (e.g., 60 seconds) of inactivity
    }).start();

  }

  this.initHandlers = function() {

    $('#messageInput').keydown(function(e){
        if (e.keyCode == 13) {
            e.preventDefault();
            self.sendChatMessage();
        }
    });

    $('#sendChatButton').click(self.sendChatMessage);

    //var firebaseURL is saved in an ENV var and included in the globals partial
    self.myDataRef = new Firebase(firebaseURL + flash_team_id +'/chats');
    console.log(firebaseURL + flash_team_id +'/chats')

    //*** online users
    // since I can connect from multiple devices or browser tabs, we store each connection instance separately
    // any time that connectionsRef's value is null (i.e. has no children) I am offline
    var myConnectionsRef = new Firebase(firebaseURL + flash_team_id + '/users/'+self.chat_uniq+'/connections');
    // stores the timestamp of my last disconnect (the last time I was seen online)
    var lastOnlineRef = new Firebase(firebaseURL + flash_team_id + '/users/'+self.chat_uniq+'/lastOnline');
    var connectedRef = new Firebase(firebaseURL + '.info/connected');

    // Get a reference to the presence data in Firebase.
    var userListRef = new Firebase(firebaseURL + flash_team_id + '/presence');

    // Generate a reference to a new location for my user with push.
    var myUserRef = userListRef.push();

    connectedRef.on('value', function(snap) {
        if (snap.val() === true) {
            // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)

            // add this device to my connections list
            // this value could contain info about the device or a timestamp too
            var con = myConnectionsRef.push(true);
            //console.log("chat_uniq: " + chat_uniq);
            con.set({ chat_uniq: self.chat_uniq, timestamp: statusTimestamp  });

            // when I disconnect, remove this device
            con.onDisconnect().remove();

            // when I disconnect, update the last time I was seen online
            lastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);

        // If we lose our internet connection, we want ourselves removed from the list.
        myUserRef.onDisconnect().remove();

        // Set our initial online status.
        self.setUserStatus("online ★");

        } else {

          // We need to catch anytime we are marked as offline and then set the correct status. We
          // could be marked as offline 1) on page load or 2) when we lose our internet connection
          // temporarily.
          self.setUserStatus(currentStatus);
        }
    });

    // Update our GUI to show someone"s online status.
    userListRef.on("child_added", function(snapshot) {
      var user = snapshot.val();
        //console.log(user);

      $("<div/>")
        .attr("id", self.getMessageId(snapshot))
        .text(user.name + " is " + user.status)
        .appendTo("#presenceDiv");

        // update display for num people online
        var numOnlineElem = $(".num-online");

        // number of occurrences of the string "is online"
        var numOnline = $("#presenceDiv").children().length;
        numOnlineElem.text(numOnline);

        //notification title
        var notif_title = user.name+' (' + user.role +') is now online ';

        //notification body
        var notif_body = new Date().toLocaleString();

        // true if the user added is the current user
        var is_current_user = (self.chat_name == user.name);

        var showchatnotif = !is_current_user; // true if notifications should be shown

        // checks if user added signed on after current user (e.g., don't show notifications for existing users on load)
        // this is used to only create notifications for people who signed on from the time you logged in and forward
        if ((statusTimestamp < user.timestamp) && showchatnotif == true && current_user == "Author"){
            playSound("/assets/notify");
            notifyMe(notif_title, notif_body, 'chat');
        }
    });

    // Update our GUI to remove the status of a user who has left.
    userListRef.on("child_removed", function(snapshot) {
      $("#presenceDiv").children("#" + self.getMessageId(snapshot))
        .remove();

        // update display for num people online
        var numOnlineElem = $(".num-online");
        var numOnline = $("#presenceDiv").children().length;
        numOnlineElem.text(numOnline);
    });

    // Update our GUI to change a user"s status.
    userListRef.on("child_changed", function(snapshot) {
      var user = snapshot.val();
      $("#presenceDiv").children("#" + self.getMessageId(snapshot))
        .text(user.name + " is " + user.status);
    });


  }

  this.getMessageId = function(snapshot) {
    return snapshot.name().replace(/[^a-z0-9\-\_]/gi,'');
  }

  this.sendChatMessage = function() {

    var text = $('#messageInput').val();
    var uniq_u=getParameterByName('uniq');

    currentTeam.logActivity("sendChatMessage()",'Send Chat Message', text);

    if(uniq_u == undefined || uniq_u == ""){
      uniq_u = 'Author';
    }

    self.myDataRef.push({name: self.chat_name, role: self.chat_role, uniq: uniq_u,
                    date: new Date().toUTCString(), text: text});

    $('#messageInput').focus().val('');
  }


// A helper function to let us set our own status
  this.setUserStatus = function(status) {
    // Set our status in the list of online users.
    currentStatus = status;
    statusTimestamp = new Date().getTime();
    if (self.chat_name != undefined && status != undefined && chat_role != undefined){
      myUserRef.set({ name: self.chat_name, status: status, role: chat_role, timestamp: statusTimestamp, chat_uniq: "author" });
    }
  }


  this.setCurrentUser = function(data) {
    self.chat_name = data["user_name"];
    self.chat_role = data["user_role"];

    if(uniq != ""){
      self.chat_uniq = uniq;
    }
    else{
      self.chat_uniq = "author";
    }

    presname = self.chat_name;

    var flashTeamsJSON = currentTeam.flash_teams_json;

    // current_user is undefined for author so just set it to 'Author'
    // when current_user is the author it won't have a uniq id so need to check for current_user == 'Author' instead
    if(self.chat_role == 'Author'){
      current_user = 'Author';
      //console.log ("CURRENT USER AUTHOR: " + current_user);
    }
    if (self.chat_role == "" || self.chat_role == null){
      uniq_u2 = data["uniq"];

      var flash_team_members = flashTeamsJSON["members"];
      for(var i=0;i<flash_team_members.length;i++){
        if (flash_team_members[i].uniq == uniq_u2){
          self.chat_role = flash_team_members[i].role;
          current = i;
          current_user = flash_team_members[i];

          // here there once existed a call to boldEvents
          trackUpcomingEvent();
        }
      }
    }
  }

  this.draw = function(data) {
    self.myDataRef.on('child_added', function(snapshot) {
      var message = snapshot.val();
      self.displayChatMessage(message.name, message.uniq, message.role, message.date, message.text);

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
      if(self.lastWriter!=name){
          self.lastMessage = (self.lastMessage+1)%2 + diff;

          var dateDiv = $('<div/>').addClass("date").text(dateform);
          var authorDiv = $('<div/>').addClass("author-header").text(name + ' (' + role + ')');
          var textDiv = $('<div/>', {"id": "m"+self.lastMessage, user: self.chat_name}).addClass("text").text(text);

          var wrapperDiv = $('<div/>').addClass('message');

          var clearDiv = $('<div class="clear"></div>');

          if(is_current_user_message) {
            wrapperDiv.addClass('by-user');
          }

          dateDiv.addClass('m'+self.lastMessage);

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

          textP.appendTo($('#messageList div[user="' + self.chat_name + '"]').last());

          $('.date.m' + self.lastMessage).text(dateform);
      }

      self.lastWriter = name;
      $('#messageList')[0].scrollTop = $('#messageList')[0].scrollHeight;
  };

  //renderChatbox
  this.render = function(){
    this.getUserData();
  }
}

extend(Chat, Wrapper)
