console.log('from backend')
/*
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {request: 'stoppoppin'}, function(response) {
        
    });
})
*/
//chrome.tabs.executeScript(null,{file:'foregroung.js'}, () => console.log('i injected'))