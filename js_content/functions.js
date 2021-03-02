var product = {}
function createPopIn(){
	$.get(chrome.extension.getURL('../html/popup_in.html'), function(data) {
	    $($.parseHTML(data)).appendTo('body');
        $(document).ready(function(){
			$("#ns_sce_import_button").click(function(){
				
				var variations = []
				var pageJosn = JSON.parse($("script#item").html())
				console.log(pageJosn.item.product.buyBox.products)
				var images=[]
				$("div.prod-ProductImage ul.slider-list").find("img").each((i,img) => {
					var primary = true;
					if(i>0){
						primary = false;
					}
					images.push({
						url:img.src.split(/(\?)/)[0],
						type:'IMAGE',
						position:i,
						primary:primary
					});
				})
				
				
				product = {
					title : $("h1.prod-ProductTitle").text(),
					currency : {
						name:$("#price span.price-currency").attr('content'),
						sign:$("#price span.price-currency:first").text()
					},
					description:$("div #about-product-section").html(),
					variations:variations,
				}
				console.log(product)
			});
		});
	});
}
createPopIn();