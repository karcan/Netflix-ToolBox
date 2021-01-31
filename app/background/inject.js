var sended=false;

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	if (msg.text === 'already_injected') {
		sendResponse({response: sended});
	}
});

function scriptFromFile(file, style = null) {
	if(style){
		var script = document.createElement("link");
		script.href = chrome.extension.getURL(file);
		script.type = "text/css";
		script.rel = "stylesheet";

	}else{
		var script = document.createElement("script");
		script.src = chrome.extension.getURL(file);
	}
	return script;
}

function scriptFromSource(source, style = null) {
	if(style){
		var script = document.createElement("style");
		script.textContent = source;
	}else{
		var script = document.createElement("script");
		script.textContent = source;
	}
		

	return script;
}

function inject(scripts) {
	if (scripts.length === 0)
		return;

	var otherScripts = scripts.slice(1);
	var script = scripts[0];

	var onload = function() {
		//script.parentNode.removeChild(script);
		inject(otherScripts);
	};
	if (script.src != "") {
		script.onload = onload;
		document.head.appendChild(script);
	} else {
		document.head.appendChild(script);
		onload();
	}
}
let options;
chrome.storage.sync.get(function(result) {
	inject([
		scriptFromFile("app/public/js/plugins/jquery-3.5.1.min.js"),
		scriptFromFile("app/background/content_scripts/netflix/lib.js"),
		scriptFromSource("netflixToolBox.userConfig = " + JSON.stringify(result.options)),
		scriptFromFile("app/background/content_scripts/netflix/custom.js"),
		scriptFromFile("app/background/content_styles/netflix/custom.css",true),
	
	]);
});

sended=true;




