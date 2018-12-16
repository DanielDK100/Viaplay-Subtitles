chrome.storage.sync.get(['vs_background', 'vs_text'], function(storageInitialize) {
    const ViaplaySubtitles = (function() {
        const _manifest = Symbol();
        const _doc = Symbol();
        const _movieQuotes = Symbol();
        const _vsBackground = Symbol();
        const _vsText = Symbol();
        const _vsStyle = Symbol();
        const _storage = Symbol();

        class ViaplaySubtitles {
            constructor(manifest, doc, movieQuotes, vsBackground, vsText, vsStyle, storage) {
                this[_manifest] = manifest;
                this[_doc] = doc;
                this[_movieQuotes] = movieQuotes;
                this[_vsBackground] = vsBackground;
                this[_vsText] = vsText;
                this[_vsStyle] = vsStyle;
                this[_storage] = storage

                this.initializeMessageListener();

                this.setManifestData(this[_manifest]);
                this.setMovieQuote(this[_doc].querySelector('.example-subtitle-cue p'), this[_movieQuotes]);
                this.setPopupColors(this[_vsStyle], this[_storage]);

                this.initializeColorPicker(this[_doc].querySelector('#background'), this[_storage].vs_background, this[_vsBackground]);
                this.initializeColorPicker(this[_doc].querySelector('#text'), this[_storage].vs_text, this[_vsText]);
            }

            static getInstance(instance) {
                return self = instance;
            }
            initializeMessageListener() {
                const vs = ViaplaySubtitles.getInstance(this);
                chrome.runtime.onMessage.addListener(
                    function(request, sender, sendResponse) {
                        if (request.color) {
                            chrome.storage.sync.get([vs[_vsBackground], vs[_vsText]], function(storageChange) {
                                vs[_doc].querySelector(`#${vs[_vsStyle]}`).innerHTML = vs.setStyles(storageChange);
                            });
                            vs.logColor(request.color);
                        }
                    });
            }
            setManifestData(manifest) {
                if (this[_doc].querySelector('#vs-container')) {
                    const titles = this[_doc].querySelectorAll('.vs-title');
                    titles.forEach(function(title) {
                        title.textContent = manifest.name;
                    });
                    this[_doc].querySelector('.vs-icon').src = manifest.icons['128'];
                    this[_doc].querySelector('.vs-icon').alt = manifest.name;
                    this[_doc].querySelector('.vs-version').textContent = manifest.version;
                }
            }
            setMovieQuote(element, movieQuotes) {
                if (element) {
                    const randomQuote = movieQuotes[Math.floor(Math.random() * movieQuotes.length)];
                    element.textContent = randomQuote;
                }
            }
            setPopupColors(id, storage) {
                const head = this[_doc].head
                if (head) {
                    const style = this[_doc].createElement('style');
                    style.type = 'text/css';
                    style.id = id;
                    style.appendChild(this[_doc].createTextNode(this.setStyles(storage)));
                    head.appendChild(style);
                }
            }
            initializeColorPicker(colorPicker, storage, setValue) {
                const vs = ViaplaySubtitles.getInstance(this);
                new Picker({
                    parent: colorPicker,
                    popup: 'bottom',
                    color: storage,
                    onDone: function(color) {
                        const object = {};
                        object[setValue] = color.hex;
                        chrome.storage.sync.set(object, function() {
                            chrome.storage.sync.get([vs[_vsBackground], vs[_vsText]], function(storageChange) {
                                vs[_doc].querySelector(`#${vs[_vsStyle]}`).innerHTML = vs.setStyles(storageChange);
                                chrome.tabs.query({url: '*://*/*'}, function(tabs) {
                                    if (tabs) {
                                        tabs.forEach(function(tab) {
                                            chrome.tabs.sendMessage(tab.id, {color: color.hex});
                                        });
                                    }
                                });
                            });
                        });
                        vs.logColor(color.hex);
                    }
                });
            }
            logColor(hexColor) {
                console.log(`%c ${hexColor}`, `color: ${hexColor}`);
            }
            setStyles(storage) {
                return `.subtitle-cue p, .example-subtitle-cue p {background: ${storage.vs_background} !important; color: ${storage.vs_text} !important;}`;
            }
        }
        return ViaplaySubtitles;
    }());

new ViaplaySubtitles(chrome.runtime.getManifest(), document, movieQuotes = 
    ["I'm going to make him an offer he can't refuse.",
    "May the Force be with you.",
    "Mama always said life was like a box of chocolates. You never know what you're gonna get.",
    "The first rule of Fight Club is you do not talk about Fight Club.",
    "Houston, we have a problem.",
    "Say hello to my little friend!",
    "Snakes. Why'd it have to be snakes?",
    "I see dead people.",
    "Elementary, my dear Watson.",
    "To infinity and beyond!"], 'vs_background', 'vs_text', 'vs-style', storageInitialize);
});