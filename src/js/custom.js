chrome.storage.sync.get(['spectrum_background', 'spectrum_text'], function(storage) {
    startInterval(10);

    var subtitles = setCurrentColors($('.example-subtitle-cue p'));
    initializeColorPicker($('#background'), storage.spectrum_background, 'spectrum_background');
    initializeColorPicker($('#text'), storage.spectrum_text, 'spectrum_text');

    function startInterval(milliseconds) {
        setInterval(function() {
            if ($('.subtitle-cue p').length) {
                $('.subtitle-cue p').css('cssText', 'background: ' + storage.spectrum_background + ' !important; color: ' + storage.spectrum_text + ' !important;');
            }
        }, milliseconds);
    }
    function setCurrentColors(element) {
        return element.css('cssText', 'background: ' + storage.spectrum_background + ' !important; color: ' + storage.spectrum_text + ' !important;');
    }
    function initializeColorPicker(colorPicker, storage, setValue) {
        colorPicker.spectrum({
            flat: true,
            color: storage,
            preferredFormat: 'rgb',
            showInput: true,
            showAlpha: true,
            maxSelectionSize: 1,
            change: function(color) {
                var object = {};
                object[setValue] = color.toRgbString();

                chrome.storage.sync.set(object, function() {
                    chrome.storage.sync.get(['spectrum_background', 'spectrum_text'], function(storageChange) {
                        subtitles.css('cssText', 'background: ' + storageChange.spectrum_background + ' !important; color: ' + storageChange.spectrum_text + ' !important;');
                    });
                });
            }
        });
    }
});