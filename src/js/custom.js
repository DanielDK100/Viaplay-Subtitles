chrome.storage.sync.get(['vs_background', 'vs_text'], function(storage) {
    var manifest = chrome.runtime.getManifest();
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

    setManifestData(manifest);
    setMovieQuote(doc.querySelector('.example-subtitle-cue p'), movieQuotes);
    var subtitles = setPopupColors(doc.querySelector('.example-subtitle-cue p'), storage);

    initializeColorPicker(doc.querySelector('#background'), storage.vs_background, 'vs_background');
    initializeColorPicker(doc.querySelector('#text'), storage.vs_text, 'vs_text');

    startInterval('.subtitle-cue p', 10);

    function setManifestData(manifest) {
        if (doc.querySelector('#vs-container')) {
            var titles = doc.querySelectorAll('.vs-title');
            titles.forEach(function(title) {
                title.textContent = manifest.name;
            });
            doc.querySelector('.vs-icon').src = manifest.icons['128'];
            doc.querySelector('.vs-icon').alt = manifest.name;
            doc.querySelector('.vs-version').textContent = manifest.version;
        }
    }
    function setMovieQuote(element, movieQuotes) {
        if (element) {
            var randomQuote = movieQuotes[Math.floor(Math.random() * movieQuotes.length)];
            element.textContent = randomQuote;
        }
    }
    function setPopupColors(element, storage) {
        if (element) {
            element.style.cssText = 'background: ' + storage.vs_background + ' !important; color: ' + storage.vs_text + ' !important;';
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
                    chrome.storage.sync.get(['vs_background', 'vs_text'], function(storageChange) {
                        subtitles.style.cssText = 'background: ' + storageChange.vs_background + ' !important; color: ' + storageChange.vs_text + ' !important;';
                    });
                });
                console.log('%c ' + color.hex +' ', 'color: ' + color.hex);
            }
        });
    }
    function startInterval(element, milliseconds) {
        setInterval(function() {
            viaplaySubtitles = doc.querySelector(element);
            if (viaplaySubtitles) {
                chrome.storage.sync.get(['vs_background', 'vs_text'], function(storage) {
                    viaplaySubtitles.style.cssText = 'background: ' + storage.vs_background + ' !important; color: ' + storage.vs_text + ' !important;';
                });
            }
        }, milliseconds);
    }
});