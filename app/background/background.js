let lastWatchId;
let lastTrackId;
let config = {};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

	if(tab.url.match(/(https?:\/\/)*(netflix)\.(com)\/(watch)/g)){

		//console.log("Status : " + changeInfo['status']);
		//console.log(changeInfo);
		//var WatchId = url.domain.pathname.split('/')[2];
		//var TrackId = url.search['trackId'];
		/*var url = app.urlParser(tab.url);


		if(changeInfo['status'] === "loading"){
			console.log(changeInfo["url"] );
			lastWatchId = "";
			lastTrackId = "";
		}*/
		
		if(//(lastWatchId !== WatchId || lastTrackId !== TrackId) &&
			changeInfo['status'] === "complete"){

			/*console.log('LastWatchId ' + lastWatchId + ' - WatchId ' + WatchId);
			console.log('LastTrackId' + lastTrackId + ' - TrackId ' + TrackId);
			console.log(changeInfo['status']);
			console.log('--------------');

			lastWatchId = WatchId;
			lastTrackId = TrackId;*/
			config.apiPath = "/metadata?webp=true&movieid=" + 1 + "&imageFormat=webp";
			chrome.tabs.sendMessage(tabId, {text: "already_injected"}, function(msg) {
					msg = msg || {};
					if (!msg.response) {
						chrome.tabs.executeScript(tab.id , {
							code : "var sc = " + JSON.stringify(config)
						}, function(){
							chrome.tabs.executeScript(tab.id , {
								file: 'app/background/inject.js'
							});
						});
					}
			});
		}
	}
 });

/* var app = {
	 urlParser: function(u){
        var parser = new URL(u); 
        var urlParams = new URLSearchParams(parser.search);
        var result = {};
        var domain = {};
        domain['host'] = parser.host;
        domain['pathname'] = parser.pathname;
        domain['port'] = parser.port;
        domain['protocol'] = parser.protocol;

        var searchTemp = {};
        for(var item of urlParams.entries()) {
            searchTemp[item[0].toString()] = item[1];
        }  
        result = {domain: domain, search: searchTemp};

        return result;
    } // TODO AJAX
 }*/