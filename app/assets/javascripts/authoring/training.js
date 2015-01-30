function openModal(){
	if ($("#password").val().indexOf("pc") == 0){
		$("#pcModal").attr("style", "display: block;");
		$('#pcModal').modal('show');
		$('.next').click(function(){
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
		$('.prev').click(function(){
			var prevId = $(this).parents('.tab-pane').prev().attr("id");
			console.log(prevId)
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
	else if ($("#password").val().indexOf("wo") == 0){
		$("#workerModal").attr("style", "display: block;");
		$('#workerModal').modal('show');
		$('.next').click(function(){
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
		});
		$('.prev').click(function(){
			var prevId = $(this).parents('.tab-pane').prev().attr("id");
			console.log(prevId)
			$('[href=#'+prevId+']').tab('show');
			if($(this)[0].className.indexOf("vidButton3") != -1){
	  			$("#youtube3").attr("src", $("#youtube3").attr("src"));
	  		}
	  		else if($(this)[0].className.indexOf("vidButton4") != -1){
	  			$("#youtube4").attr("src", $("#youtube4").attr("src"));
	  		}
		});
		$("#workerModal").on('hidden.bs.modal', function (e) {
    		$("#workerModal .tab-pane iframe").attr("src", $("#workerModal .tab-pane iframe").attr("src"));
		});
		$('.first').click(function(){
	  		$('#workerWizard a:first').tab('show')
		});	
	}
	else if($("#password").val() == ""){
		alert("You must enter a code to launch training");
	}
	else{
		alert("I'm sorry. The code you entered does not match our records. Please wait to recieve a code from us.");
	}
}

function showForm(){
	console.log("Hits this");
	$(".formDiv").attr("style", "display:inline");
	$("#launchDiv").attr("style", "display:none");
	document.getElementById("topText").innerHTML="Thank you for completing the training!";
}