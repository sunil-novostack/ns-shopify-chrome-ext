chrome.runtime.onMessage.addListener(sendAuthentication);

function sendAuthentication(user_data, sender, sendResponse){
	
	var status = "";
	var data = "";
	var product_create_message = "Error! There is an error creating the product";
	// Authenticate User
	if (user_data.request == 'auth_form'){
		chrome.storage.local.get(null, function(result) {
			url = user_data.wordpressurl;
		    var auth_url = url+'wp-json/woo-aliexpress/v1/woo-authentication';
			$.ajax({
	          async: true,
			  type: 'POST',
			  url: auth_url,
			  dataType: "json",
			  contentType: "application/json",
			  data: JSON.stringify({
				    woo_url: user_data.wordpressurl,
					woo_api_key: user_data.apikey,
			  }),
			  error: function(e) {
			    sendResponse({'status': 'failed'});
			    return false;
			  },
			  success: function(data){
			  	if (data.code == "success"){
			  		// save to local storage
			        status = "success";
			        chrome.storage.local.set(user_data, function() {
			        });
			  	}else{
			        status = "fail";
			  	}
			sendResponse({'status': status});
			  }
			});
		}); //end of google local storage
		return true;
	}

	// Create Product
	if (user_data.request == 'create_product'){
		chrome.storage.local.get(null, function(result) {
			url = result.wordpressurl;
			let create_prod_url = url+'wp-json/woo-aliexpress/v1/product';
			console.log('create product URL', create_prod_url);
			$.ajax({
				async: false,
				type: 'POST',
				url: create_prod_url,
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify(user_data),
				error: function(e) {
				status = 'failed';
				product_create_message = e;
				},
				success: function(data){
				status = 'success';
				product_create_message = data;
				}
			});
			sendResponse({'status': status, 'data':product_create_message});
		}); //end of google local storage
	return true;
	}

	// Update Product
	if (user_data.request == 'update_product'){
		console.log(user_data);
		console.log('updating products...');
		chrome.storage.local.get(null, function(result) {
			url = result.wordpressurl;
			let update_prod_url = url+'wp-json/woo-aliexpress/v1/update-product';
			console.log('----userdata----', user_data);
			console.log('this is the url', update_prod_url);
			$.ajax({
        async: false,
			  type: 'POST',
			  url: update_prod_url,
			  dataType: "json",
			  contentType: "application/json",
			  data: JSON.stringify(user_data),
			  error: function(e) {
			  	status = 'failed';
			  	product_create_message = e;
			  },
			  success: function(data){
			  	status = 'success';
			  	product_create_message = data;
			  }
			});
			sendResponse({'status': status, 'data':product_create_message});
		}); //end of google local storage
	return true;
	}

	// Get Categories
	if (user_data.request == 'get_categories'){
		chrome.storage.local.get(null, function(result) {
			url = result.wordpressurl;
			let get_cat_url = url+'wp-json/woo-aliexpress/v1/products-categories';
			$.ajax({
	          async: true,
			  type: 'GET',
			  url: get_cat_url,
			  error: function(e) {
			  },
			  success: function(data){
				sendResponse({data});
			  	}
			});
		}); //end of google local storage
		return true;
	}

	//Create Categories
	if (user_data.request == 'new_cat'){
		chrome.storage.local.get(null, function(result) {
			url = result.wordpressurl;
			let new_cat_url = url+'wp-json/woo-aliexpress/v1/create-categories';
			$.ajax({
	          async: false,
			  type: 'POST',
			  url: new_cat_url,
			  dataType: "json",
			  contentType: "application/json",
			  data: JSON.stringify(user_data),
			  error: function(e) {
			  },
			  success: function(data){
			  	if (data.code == "success"){
			  		// save to local storage
			        status = "success";
			  	}else{
			        status = "fail";
			  	}
			  }
			});
		sendResponse({'status': status});
		}); //end of google local storage
	return true;
	}


	if (user_data.request == 'deactivate'){
        chrome.storage.local.set({activate: 0}, function() {
        });
		sendResponse({status:0});
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.sendMessage(tabs[0].id, {request: 'stoppoppin'}, function(response) {
		  });
		});
	}

	if (user_data.request == 'activate'){
		chrome.storage.local.get(null, function(result) {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {request: 'runpopin'}, function(response) {
				});
			});
		});
        chrome.storage.local.set({activate: 1}, function() {
        });
		sendResponse({status:1});
	}

	if (user_data.request == 'checkout_order'){
		response = 'okay';
		sendResponse(response);
		return true;
	}

	if (user_data.request == 'open_orders'){
		var newURL = "https://www.aliexpress.com/item/";
		let user_data_product_id = user_data.ae_product_skus;
		for (let i = 0; i < user_data_product_id.length; i++){
			chrome.tabs.create({
				url: newURL + user_data_product_id[i] + '.html'

			});
		}
	}

	if (user_data.request == 'get_order'){
		let order_id = parseInt(user_data.order_id);
		data_to_send = {id:order_id};
		chrome.storage.local.get(null, function(result) {
			url = result.wordpressurl;
			let new_cat_url = url+'wp-json/woo-aliexpress/v1/order-details';
			$.ajax({
	          async: false,
			  type: 'POST',
			  url: new_cat_url,
			  dataType: "json",
			  contentType: "application/json",
			  data: JSON.stringify(data_to_send),
			  error: function(e) {
			  },
			  success: function(data){

			  	console.log(data, 'New Data');
			  	if (data.code == "success"){
			  		// save to local storage
			  		chrome.storage.local.set({ae_items:data.content.line_items});
			        status = "success";
					sendResponse(data);
			  	}else{
			        status = "fail";
			  	}
			  }
			});
		}); //end of google local storage
	return true;
	}

	if (user_data.request == 'check_product_status'){
		data_to_send = {
			sku: user_data.sku
		}
		chrome.storage.local.get(null, function(result) {
			url = result.wordpressurl;
			let new_cat_url = url+'wp-json/woo-aliexpress/v1/product-sku';
			$.ajax({
			  async: false,
			  type: 'POST',
			  url: new_cat_url,
			  dataType: "json",
			  contentType: "application/json",
			  data: JSON.stringify(data_to_send),
			  error: function(e) {
			    status = "fail";
			  },
			  success: function(data){
			  	if (data.code == "success"){
			  		// save to local storage
			        status = "success";
			  	}
			  }
			});
		  sendResponse({'status': status});
		}); //end of google local storage
	return true;
	}
	if (user_data.request == 'update_order_status'){
		let order_id = parseInt(user_data.order_id);
		let order_status= "Order Placed";
		data_to_send = {id:order_id,ae_status:order_status};
		chrome.storage.local.get(null, function(result) {
			url = result.wordpressurl;
			let new_cat_url = url+'wp-json/woo-aliexpress/v1/order-details/update-status';
			$.ajax({
	      async: false,
			  type: 'POST',
			  url: new_cat_url,
			  dataType: "json",
			  contentType: "application/json",
			  data: JSON.stringify(data_to_send),
			  error: function(e) {
			  },
			  success: function(data){

			  	console.log(data, 'New Data');
			  	if (data.code == "success"){
			  		// // save to local storage
			  		// chrome.storage.local.set({ae_items:data.content.line_items});
			        status = "success";
					sendResponse(data);
			  	}else{
			        status = "fail";
			  	}
			  }
			});
		}); //end of google local storage
	return true;
	}

	if(user_data.request == 'change_icon'){
		if (user_data.conn_status == 'disconnected'){
			// Icon has been changed
			chrome.browserAction.setIcon({
				path:"../images/opmc_logo_disconnected.png"
			});
			chrome.browserAction.setTitle({'title': 'Disconnected'})
		}else{
			// Icon has been changed
			chrome.browserAction.setIcon({
				path:"../images/opmc_logo.png"
			});
			chrome.storage.local.get(null, function(result) {
				chrome.browserAction.setTitle({'title': 'Connected to '+result.wordpressurl})
			});
		}
	}


// Ali CBE settings
	if(user_data.request == 'get_settings_woo'){
		chrome.storage.local.get(null, function(result) {
			url = result.wordpressurl;
			let new_cat_url = url+'wp-json/woo-aliexpress/v1/price-rate';
			$.ajax({
	      async: false,
			  type: 'GET',
			  url: new_cat_url,
			  dataType: "json",
			  contentType: "application/json",
			  error: function(e) {
			  },
			  success: function(data){

			  	console.log(data, 'This is it');
			  	if (data.code == "success"){
			  		// // save to local storage
			  		// chrome.storage.local.set({ae_items:data.content.line_items});
			        status = "success";
					sendResponse(data);
			  	}else{
			        status = "fail";
			  	}
			  }
			});
		}); //end of google local storage
	return true;
		console.log('ALI CBE WORKING -----------------------------')
	}

} //End of chrome internal listener
