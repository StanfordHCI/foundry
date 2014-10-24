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

function test(name){

	alert("hi " + name);

}




