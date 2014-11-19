$(".show-online-button").click(function(e) {
  $("#presenceDiv").slideToggle("linear");
});

function chatResize() {
  var messageList = $("#messageList");
  var h = $("#right-sidebar .entry").offset().top -
          messageList.offset().top;
  messageList.css({
    height: h + "px",
  });
}