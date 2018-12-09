chrome.runtime.onInstalled.addListener(function(details) {
	if(details.reason == 'install') {
		chrome.storage.sync.set({'vs_background': '#000000', 'vs_text': '#ffffff'});
	}
});