/* training.js
----------------------
* File is in charge of the code for the onboarding required to join the panels. 
* Creates training modals for both workers and PCs
* Note: It references YouTube videos created and stored in Tulsee Doshi's gmail account
*/

var user_panel_pw; 

//Code that opens the modal
function openModal(){

	//Sets up PC training
	if ($("#password").val().indexOf("pc") == 0){
		user_panel_pw = $("#password").val();
		$("#pcModal").attr("style", "display: block;");
		$('#pcModal').modal('show');
		$('.next').click(function(){//Edge cases for last panel and youtube videos
	  		var nextId = $(this).parents('.tab-pane').next().attr("id");
	  		if (nextId == "step10"){
	  			document.getElementById("pcCompleteBtn").disabled = false;	  		
			}
	  		$('[href=#'+nextId+']').tab('show');
	  		if($(this)[0].className.indexOf("vidButton1") != -1){
	  			$("#youtube1").attr("src", $("#youtube1").attr("src"));
	  		}
	  		else if($(this)[0].className.indexOf("vidButton2") != -1){
	  			$("#youtube2").attr("src", $("#youtube2").attr("src"));
	  		}
		});
		$('.prev').click(function(){//Edge cases for first panel and youtube videos
			var prevId = $(this).parents('.tab-pane').prev().attr("id");
			$('[href=#'+prevId+']').tab('show');
			if($(this)[0].className.indexOf("vidButton1") != -1){
	  			$("#youtube1").attr("src", $("#youtube1").attr("src"));
	  		}
	  		else if($(this)[0].className.indexOf("vidButton2") != -1){
	  			$("#youtube2").attr("src", $("#youtube2").attr("src"));
	  		}
		});
		$('.first').click(function(){
	  		$('#pcWizard a:first').tab('show')
		});
		$("#pcModal").on('hidden.bs.modal', function (e) {
    		$("#pcModal .tab-pane iframe").attr("src", $("#pcModal .tab-pane iframe").attr("src"));
		});
	}

	//Sets up worker training
	else if ($("#password").val().indexOf("wo") == 0 || $("#password").val() == "refresher"){
		user_panel_pw = $("#password").val();
		$("#workerModal").attr("style", "display: block;");
		$('#workerModal').modal('show');
		$('.next').click(function(){//Edge cases for last panel and youtube videos
	  		var nextId = $(this).parents('.tab-pane').next().attr("id");
	  		if (nextId == "part5"){
	  			document.getElementById("woCompleteBtn").disabled = false;	  		
			}
	  		$('[href=#'+nextId+']').tab('show');
	  		if($(this)[0].className.indexOf("vidButton3") != -1){
	  			$("#youtube3").attr("src", $("#youtube3").attr("src"));
	  		}
	  		else if($(this)[0].className.indexOf("vidButton4") != -1){
	  			$("#youtube4").attr("src", $("#youtube4").attr("src"));
	  		}
	  		else if($(this)[0].className.indexOf("vidButton5") != -1){
	  			$("#youtube5").attr("src", $("#youtube5").attr("src"));
	  		}
		});
		$('.prev').click(function(){//Edge cases for first panel and youtube videos
			var prevId = $(this).parents('.tab-pane').prev().attr("id");
			$('[href=#'+prevId+']').tab('show');
			if($(this)[0].className.indexOf("vidButton3") != -1){
	  			$("#youtube3").attr("src", $("#youtube3").attr("src"));
	  		}
	  		else if($(this)[0].className.indexOf("vidButton4") != -1){
	  			$("#youtube4").attr("src", $("#youtube4").attr("src"));
	  		}
	  		else if($(this)[0].className.indexOf("vidButton5") != -1){
	  			$("#youtube5").attr("src", $("#youtube5").attr("src"));
	  		}
		});
		$("#workerModal").on('hidden.bs.modal', function (e) {
    		$("#workerModal .tab-pane iframe").attr("src", $("#workerModal .tab-pane iframe").attr("src"));
		});
		$('.first').click(function(){
	  		$('#workerWizard a:first').tab('show')
		});	
	}

	//Requests a code
	else if($("#password").val() == ""){
		alert("You must enter a code to launch training");
	}

	//Incorrect code
	else{
		alert("I'm sorry. The code you entered does not match our records. Please wait to recieve a code from us.");
	}
}

//Code to display the registration form
function showForm(){
	$("#launchDiv").attr("style", "display:none");
	$(".footer").attr("style", "position: relative");
	$("#topText").attr("class", "span6");

	if(user_panel_pw == "refresher"){
		document.getElementById("topText").innerHTML="Thank you for reviewing the training. <br /><br /> <b>Don't forget to add " + defaultEmail + " to your address book to prevent job notifications from going to your spam folder.</b>";
	}
	else{
		$(".formDiv").attr("style", "display:inline");
		document.getElementById("topText").innerHTML="Thank you for completing the training. Please complete the registration form below to be added to the panel and start receiving job notifications! <br /><br /> <b>Don't forget to add " + defaultEmail + " to your address book to prevent job notifications from going to your spam folder.</b>";
		$("#worker_panel").val(user_panel_pw);
	}
	
}