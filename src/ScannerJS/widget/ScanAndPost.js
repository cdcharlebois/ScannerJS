import {
    defineWidget,
    log,
    runCallback,
} from 'widget-base-helpers';
import scanner from 'scanner.js';

export default defineWidget('ScanAndPost', false, {

    _obj: null,
    _Scanner: window.scanner,

    constructor() {
        this.log = log.bind(this);
        this.runCallback = runCallback.bind(this);
    },

    postCreate() {
        log.call(this, 'postCreate', this._WIDGET_VERSION);
        console.log(this._Scanner);
        this.scanToJpg();
    },

    scanToJpg() {
        this._Scanner.scan(this.displayImagesOnPage.bind(this), {
            "output_settings": [{
                "type": "return-base64",
                "format": "jpg"
            }]
        });
    },

    displayImagesOnPage(success, msg, res) {
        if (!success) { // On error
            console.error('Failed: ' + mesg);
            return;
        }

        if (success && msg != null && msg.toLowerCase().indexOf('user cancel') >= 0) { // User canceled.
            console.info('User canceled');
            return;
        }

        var scannedImages = this._Scanner.getScannedImages(res, true, false); // returns an array of ScannedImage
        for (var i = 0;
            (scannedImages instanceof Array) && i < scannedImages.length; i++) {
            var scannedImage = scannedImages[i];
            this.processScannedImage(scannedImage);
        }
    },

    /** Processes a ScannedImage */
    processScannedImage(scannedImage) {
        var imgEl = document.createElement("img");
        imgEl.className = "scanned";
        imgEl.src = scannedImage.src;
        this.domNode.appendChild(imgEl);
    }
});