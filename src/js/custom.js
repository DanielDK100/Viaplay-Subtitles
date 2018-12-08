chrome.storage.sync.get(['spectrum_background', 'spectrum_text'], function(storage) {
    var doc = document;
    var movieQuotes = [
    "I'm going to make him an offer he can't refuse.",
    "May the Force be with you.",
    "Mama always said life was like a box of chocolates. You never know what you're gonna get.",
    "The first rule of Fight Club is you do not talk about Fight Club.",
    "Houston, we have a problem.",
    "Say hello to my little friend!",
    "Snakes. Why'd it have to be snakes?",
    "I see dead people.",
    "Elementary, my dear Watson.",
    "To infinity and beyond!"
    ];

    setMovieQuote(doc.querySelector('.example-subtitle-cue p'), movieQuotes);
    var subtitles = setPopupColors(doc.querySelector('.example-subtitle-cue p'));

    startInterval(10);
    initializeColorPicker(doc.querySelector('#background'), storage.spectrum_background, 'spectrum_background');
    initializeColorPicker(doc.querySelector('#text'), storage.spectrum_text, 'spectrum_text');


    function setMovieQuote(element, movieQuotes) {
        if (element) {
            var randomQuote = movieQuotes[Math.floor(Math.random() * movieQuotes.length)];
            element.textContent = randomQuote;
        }
    }
    function setPopupColors(element) {
        if (element) {
            element.style.cssText = 'background: ' + storage.spectrum_background + ' !important; color: ' + storage.spectrum_text + ' !important;';
            return element;
        }
    }
    function startInterval(milliseconds) {
        setInterval(function() {
            viaplaySubtitles = doc.querySelector('.subtitle-cue p');
            if (viaplaySubtitles) {
                viaplaySubtitles.style.cssText = 'background: ' + storage.spectrum_background + ' !important; color: ' + storage.spectrum_text + ' !important;';
            }
        }, milliseconds);
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
                console.log('%c ' + color.hex +' ', 'color: ' + color.hex);
                doc.querySelector('#alert').classList.remove('d-none');
            }
        });
    }
});