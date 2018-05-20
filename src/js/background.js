chrome.runtime.onInstalled.addListener(function(details) {
	if(details.reason == 'install'){
		chrome.storage.sync.set({'spectrum_background': '#000000', 'spectrum_text': '#ffffff'});
	}
});