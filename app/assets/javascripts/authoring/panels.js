$('#panels').change(function(){
	  var request = $.ajax({
	    url: "/workers/filter_workers",
	    type: "GET",
	    data: {panels : document.getElementById("panels").value },
	    dataType: "html"
	    }); //end var request
	   
	    request.done(function( msg ) {
	     $("#filter_results").html( msg );
	    }); //end request.done
 });


var selWorkers = [];

$('input[type=checkbox]').change(function(e){
      
   if($(this).is(':checked')) {
   		selWorkers.push(this.value);
    } else {
      var removeItem = this.value;
	  selWorkers = jQuery.grep(selWorkers, function(value) {
		  return value != removeItem;
	  });
    }
    console.log(selWorkers);
           
   var request = $.ajax({
	   url: "/workers/filter_workers_emails",
	   type: "GET",
	   data: {workers : selWorkers },
	   dataType: "html"
	}); //end var request

	request.done(function( msg ) {
		$("#worker_results").html( msg );
	}); //end request.done

 });
 
 
/*The code below updates the content of the edit modal each time you click on the edit button next to a worker in the panel
(fixes the issue that was causing the same worker information to appear in the edit modal unless you refreshed the page)
found via: http://stackoverflow.com/questions/13104919/twitter-bootstrap-modal-loads-wrong-remote-data
copied from: http://jsfiddle.net/Sherbrow/ThLYb/ */

$('[data-load-remote]').on('click',function(e) {
    e.preventDefault();
    var $this = $(this);
    var remote = $this.data('load-remote');
    if(remote) {
        $($this.data('remote-target')).load(remote);
    }
});


/*Zero Clipboard All Emails Copy Button */ 

var client = new ZeroClipboard( document.getElementById("copy-button") );

client.on( "ready", function( readyEvent ) {
  // alert( "ZeroClipboard SWF is ready!" );

  client.on( "aftercopy", function( event ) {
    // `this` === `client`
    // `event.target` === the element that was clicked
    //event.target.style.display = "none";
    alert("Copied emails to clipboard: " + event.data["text/plain"] );
  } );
} );

