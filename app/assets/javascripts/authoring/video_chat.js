
//var appToken = "MDAxMDAxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD3xuuRW9ergFQQYALQb%2BEHkkHPsrYd%2FQFOqBzJXiixmuCA4395GXczhM1ULtiLB5VUljET1zVfJfhqrZx279kqdeqWJj0TTWbZcW7QmzDgT98c3yCEFDCU9w6cQQ99N3Pnyp6MmZiOkI9kyZSHx84V";
var conference = null;
var conferenceId = "Please insert your Conference ID";
        
function createVideoConf(room_name){
    console.log('calling createVideoConf');

    conferenceId = room_name;
        ooVoo.API.init({ 
            appId: "12349983353625",
            appToken: "MDAxMDAxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD3xuuRW9ergFQQYALQb%2BEHkkHPsrYd%2FQFOqBzJXiixmuCA4395GXczhM1ULtiLB5VUljET1zVfJfhqrZx279kqdeqWJj0TTWbZcW7QmzDgT98c3yCEFDCU9w6cQQ99N3Pnyp6MmZiOkI9kyZSHx84V"
          }, onAPI_init);
        $("#vc").append('<video id="localVideo" style="width:50%; height:auto;" autoplay muted></video>')
        
        $("#videoChatModal").modal('show');
}

        function onAPI_init(res) {
            conference = ooVoo.API.Conference.init({ video: true, audio: true }, onConference_init);
        }
        function onConference_init(res) {
            if (!res.error) {
                //register to conference events
                conference.onParticipantJoined = onParticipantJoined;
                conference.onParticipantLeft = onParticipantLeft;
                conference.onLocalStreamPublished = onStreamPublished;
                conference.onConferenceStateChanged = onConferenceStateChanged;
                conference.onRemoteVideoStateChanged = onRemoteVideoStateChanged
                conference.setConfig({
                    videoResolution: ooVoo.API.VideoResolution["HIGH"],
                    videoFrameRate: new Array(5, 15)
                }, function (res) {
                    if (!res.error) {
            var participantId = "participant uniqe id";
            //for example (get random id)
            participantId = Math.floor(Math.random() * 9999999999) + 1000000000;
                        conference.join(conferenceId, participantId, "participant name", function (result) { });
                    }
                });
            }
        }
        function onStreamPublished(stream) {
            document.getElementById("localVideo").src = URL.createObjectURL(stream.stream);
        }
        function onParticipantLeft(evt) {
            if (evt.uid) {
                document.getElementById("vid_" + evt.uid).remove();
            }
        }
        function onParticipantJoined(evt) {
            if (evt.stream && evt.uid != null) {
                var videoElement = document.createElement("video");
                videoElement.id = "vid_" + evt.uid;
                videoElement.src = URL.createObjectURL(evt.stream);
                videoElement.setAttribute("autoplay", true);
                document.body.appendChild(videoElement);
            }
        }
    function onConferenceStateChanged(evt){
    }
    function onRemoteVideoStateChanged(evt){
    }

// var comm = new Icecomm('47SZFqOPw46qw5PrJxOWDSUrQYix/aoeRodBwfIPecrGHzkY');

// function createVideoConf(room_name){
// 	comm.connect(room_name);
	
// 	$("#vc").append('<video id="localVideo" autoplay></video>');

// 	//$("#vc").html('<video id="localVideo" autoplay></video>');
// 	$("#videoChatModal").modal('show');

//   logActivity("createVideoConf(room_name)",('Created Video Conference - Room Name: ' + room_name), new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
	
// }


// comm.on('connected', function(options) {
//   createRemoteVideo(options.stream, options.callerID);
// });

// comm.on('local', function(options) {
//   localVideo.src = options.stream;
// });

// comm.on('disconnect', function(options) {
//   document.getElementById(options.callerID).remove();
// });

// function disconnectVC(){
// 	comm.close();
// 	//$("video").remove();
// 	$("#videoChatModal").modal('hide');
//   logActivity("disconnectVC()","Disconnected Video Conference", new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);

	
// }

// $("#videoChatModal").on('hide', function () {
//         window.location.reload();
//     });

// function createRemoteVideo(stream, key) {
//   var remoteVideo = document.createElement('video');
//   remoteVideo.src = stream;
//   remoteVideo.id = key;
//   remoteVideo.autoplay = true;
//   $("#vc").append(remoteVideo);
//   ///document.body.appendChild(remoteVideo);
//   //$("#task-modal-body").html('<video id="localVideo" autoplay></video>');
// }

/*
comm.connect('custom room', {audio: false});

comm.on('connected', function(options) {
   document.body.appendChild(options.video);
});

comm.on('local', function(options) {
  localVideo.src = options.stream;
});

comm.on('disconnect', function(options) {
  document.getElementById(options.callerID).remove();
});
*/	
