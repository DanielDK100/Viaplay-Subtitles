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
var vsBackground = 'vs_background';
var vsText = 'vs_text';
var vsStyle = 'vs-style';

chrome.storage.sync.get([vsBackground, vsText], function(storage) {
    initializeMessageListener(vsBackground, vsText, vsStyle);

    setManifestData(manifest);
    setMovieQuote(doc.querySelector('.example-subtitle-cue p'), movieQuotes);
    setPopupColors(vsStyle, storage);

    initializeColorPicker(doc.querySelector('#background'), storage.vs_background, vsBackground);
    initializeColorPicker(doc.querySelector('#text'), storage.vs_text, vsText);

    function initializeMessageListener(vsBackground, vsText, vsStyle) {
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if (request.color) {
                    chrome.storage.sync.get([vsBackground, vsText], function(storageChange) {
                        doc.querySelector('#' + vsStyle).innerHTML = setStyles(storageChange);
                    });
                    logColor(request.color);
                }
            });
    }
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
    function setPopupColors(id, storage) {
        var head = doc.head
        if (head) {
            var style = doc.createElement('style');
            style.type = 'text/css';
            style.id = id;
            style.appendChild(doc.createTextNode(setStyles(storage)));
            head.appendChild(style);
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
                    chrome.storage.sync.get([vsBackground, vsText], function(storageChange) {
                        doc.querySelector('#' + vsStyle).innerHTML = setStyles(storageChange);
                        chrome.tabs.query({url: '*://*/*'}, function(tabs) {
                            if (tabs) {
                                tabs.forEach(function(tab) {
                                    chrome.tabs.sendMessage(tab.id, {color: color.hex});
                                });
                            }
                        });
                    });
                });
                logColor(color.hex);
            }
        });
    }
    function logColor(hexColor) {
        console.log('%c ' + hexColor +' ', 'color: ' + hexColor);
    }
    function setStyles(storage) {
        return '.subtitle-cue p, .example-subtitle-cue p {background: ' + storage.vs_background + ' !important; color: ' + storage.vs_text + ' !important;}';
    }
});