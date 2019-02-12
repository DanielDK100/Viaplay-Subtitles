const ViaplaySubtitlesBackground = (function() {
	const _vsBackground = Symbol();
	const _background = Symbol();
	const _vsText = Symbol();
	const _text = Symbol();

	class ViaplaySubtitlesBackground {
		constructor(vsBackground, background, vsText, text) {
			this[_vsBackground] = vsBackground;
			this[_background] = background;
			this[_vsText] = vsText;
			this[_text] = text;

			this.setDefaultColors(this[_vsBackground], this[_background], this[_vsText], this[_text]);
		}

		setDefaultColors(vsBackground, background, vsText, text) {
			chrome.runtime.onInstalled.addListener(function(details) {
				if(details.reason == 'install') {
					const object = {};
					object[vsBackground] = background;
					object[vsText] = text;
					chrome.storage.sync.set(object);
				}
			});
		}
	}
	return ViaplaySubtitlesBackground;
}());

new ViaplaySubtitlesBackground('vs_background', '#000000', 'vs_text', '#ffffff');
