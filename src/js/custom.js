chrome.storage.sync.get(['spectrum_background', 'spectrum_text'], function(storage) {
    var doc = document;
    var subtitles = setPopupColors(doc.querySelector('.example-subtitle-cue p'));

    startInterval(10);
    initializeColorPicker(doc.querySelector('#background'), storage.spectrum_background, 'spectrum_background');
    initializeColorPicker(doc.querySelector('#text'), storage.spectrum_text, 'spectrum_text');


    function startInterval(milliseconds) {
        setInterval(function() {
            viaplaySubtitles = doc.querySelector('.subtitle-cue p');
            if (viaplaySubtitles) {
                viaplaySubtitles.style.cssText = 'background: ' + storage.spectrum_background + ' !important; color: ' + storage.spectrum_text + ' !important;';
            }
        }, milliseconds);
    }
    function setPopupColors(element) {
        if (element) {
            element.style.cssText = 'background: ' + storage.spectrum_background + ' !important; color: ' + storage.spectrum_text + ' !important;';
            return element;
        }
    }
    function initializeColorPicker(colorPicker, storage, setValue) {
        new Picker({
            parent: colorPicker,
            popup: 'bottom',
            color: storage,
            onDone: function(color) {
                var object = {};
                object[setValue] = color.hex;

                chrome.storage.sync.set(object, function() {
                    chrome.storage.sync.get(['spectrum_background', 'spectrum_text'], function(storageChange) {
                        subtitles.style.cssText = 'background: ' + storageChange.spectrum_background + ' !important; color: ' + storageChange.spectrum_text + ' !important;';
                    });
                });
            }
        });
    }
});