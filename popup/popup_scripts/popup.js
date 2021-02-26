console.log('-----popup.js-------');
$(document).ready(function(){

	loadActDeactButton();
	//showCorrectPopup();
	displayNotification();

	//Setup button
	$("#ae_setup").click(function(){
		//console.log('TTTTTTTTTTTTTTTT');
		chrome.storage.local.get(null, function(result) {
			console.log('--------------------------', result);
		  	if (result.first_time == 0){
				if(confirm('Are you sure you wish to proceed?')){
					setupButton();
				}else{
					return false;
				}
		  	}else{
		  		setupButton();
		  	}
		}); // End of storage
	}); // End of function

	//Setting button
	$("#ae_settings").click(function(){
		console.log('settings');
		/*
		chrome.storage.local.get(data, function(result) {
			console.log('--------------------------', result);
		}); // End of storage
		*/
	});
	
	// Deactivate button
	if ($('#ae_deactivate').length){
		$("#ae_deactivate").click(function(){
			// Send message to content script to remove toolbar

			var user_data = {
				request: "deactivate",
				activate: 0
			};

			chrome.runtime.sendMessage(user_data, function(response){
				console.log(response);
				if(typeof response.status != 'undefined'){
					switchActivate(response.status);
				}
			});
		});
	}

	// Activate button
	if ($('#ae_activate').length){
		$("#ae_activate").click(function(){
			// Send message to content script to remove toolbar

			var user_data = {
				request: "activate",
				activate: 1
			};

			chrome.runtime.sendMessage(user_data, function(response){
				console.log(response);
				if(typeof response.status != 'undefined'){
					switchActivate(response.status);
				}
			});
		});
	}

chrome.storage.local.get(null, function(result) {
		if (result.first_time == 1){
			$('.act_deact').css('display', 'none');
		}else{
			$('.act_deact').css('display', 'block');
		}
	});

}); // End of document ready


function switchActivate(result){
	chrome.storage.local.get(null, function(result) {
		console.log('Result inside function', result);
		if (typeof result.activate != 'undefined'){
		  	if (result.activate == 1){
		  		console.log('hide activate');
		  		$('#ae_activate').toggle();
		  		$('#ae_deactivate').toggle();
		  	}else{
		  		console.log('hide deactivate');
		  		$('#ae_deactivate').toggle();
		  		$('#ae_activate').toggle();
		  	}
		}
	});
}


function setupButton(){
	console.log('sending setup now to background');
	/*
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {request: "pop_authenticate"}, function(response) {
	    if(response.status == 'success'){
	    	console.log('success!');
	    	$('.act_deact').css('display', 'none');
	    }
	  });
	}); // End of sending data
	*/
}

function loadActDeactButton(){
	chrome.storage.local.get(null, function(result) {
		console.log('THIS IS THE RESULT', result);
		if (typeof result != 'undefined'){
			console.log('-------RESULT FROM POPUP', result.activate);
		  	if (result.activate == 1){
		  		$('#ae_activate').css('display', 'none');
		  		$('#ae_deactivate').css('display', 'block');
		  	}else{
		  		$('#ae_deactivate').css('display', 'none')
		  		$('#ae_activate').css('display', 'block')
		  	}
		}
	});
}

function displayNotification(){
	/*
	chrome.storage.local.get(null, function(result){
		console.log(result.show_popup);
		result.show_popup=1;
		if (result.show_popup == 1){
			console.log('notif should show now');
			$('#ae_setup_list').css('display', 'block');
			$('#notification_for_user').css('display', 'none');
		}else{
			console.log('list should show now');
			$('#ae_setup_list').css('display', 'none');
			$('#notification_for_user').css('display', 'block');
		}
	});
	*/
	$('#ae_setup_list').css('display', 'block');
	$('#notification_for_user').css('display', 'none');
}

function showCorrectPopup(){
	
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {request: "show_popup"}, function(response) {
		  console.log(response)
	    if(response.status == 'success'){
	    	displayNotification();
	    }
	  });
	}); // End of sending data
	
}
