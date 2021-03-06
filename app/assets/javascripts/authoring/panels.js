$('#panels').change(function(){
	  var request = $.ajax({
	    url: "/workers/filter_workers",
	    type: "GET",
	    data: {panels : document.getElementById("panels").value },
	    dataType: "html"
	    }); //end var request
	   
	    request.done(function( msg ) {
	     $("#panel_results").html( msg );
	    }); //end request.done
 });

$('#panels_right').change(function(){
	  var request = $.ajax({
	    url: "/workers/filter_workers_rightsidebar",
	    type: "GET",
	    data: {panels : document.getElementById("panels_right").value },
	    dataType: "html"
	    }); //end var request
	   
	    request.done(function( msg ) {
	     $("#filter_results").html( msg );
	     copyEmailsToForm();
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
		//$("#recipient_email").val( msg );
	}); //end request.done

	
	//for sidebar view
	var req2 = $.ajax({
	   url: "/workers/right_sidebar_filt",
	   type: "GET",
	   data: {workers : selWorkers },
	   //dataType: "html"
	}); //end var request

	req2.done(function( res ) {
		//$("#worker_results").html( msg );
		res_trim = res.trim();
		$("#recipient_email").val(res_trim);
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

function copyEmailsToForm() {
	console.log("in copy emails");
	emails = document.getElementById("copy-emails-button").getAttribute("data-clipboard-text");
	console.log("emails: " + emails);
 	$("#recipient_email").val(emails);		
 }

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

function insertFoundryLink(sel){
	link = sel.value.split(',');
	foundry_member_url = link[1].substring(2, link[1].length-2);
	console.log("link: " + link[1].substring(2, link[1].length-2));

	$("#foundry_member_url").val(foundry_member_url);
}

function hideRightPanels(){	
	$("#hidePanelsLink").html('View Panels');
	$("#right-sidebar-wrapper").css('display', 'none');
	$("#hidePanelsLink").attr('onclick', 'viewRightPanels()');
	$("#email-form-div").removeClass("span8");
	$("#email-form-div").addClass("span12");
}	

function viewRightPanels(){	
	$("#hidePanelsLink").html('Hide Panels');
	$("#right-sidebar-wrapper").css('display', '');
	$("#hidePanelsLink").attr('onclick', 'hideRightPanels()');
	$("#email-form-div").removeClass("span12");
	$("#email-form-div").addClass("span8");
}	

/*---LEFT BAR ACCORDION----*/
/*
$(function() {
    $('#nav-accordion').dcAccordion({
        eventType: 'click',
        autoClose: true,
        saveState: true,
        disableLink: true,
        speed: 'slow',
        showCount: false,
        autoExpand: true,
//        cookie: 'dcjq-accordion-1',
        classExpand: 'dcjq-current-parent'
    });
});
*/