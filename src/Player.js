/**
 *
 * @class Player
 */
export class Player {

    /**
     *
     * @constructor
     */
    constructor() {

        this.canvas = null;

        this.context = null;
        this.buffer  = null;
        this.source  = null;

        this.analyser     = null;
        this.analyserNode = null;

        // time of the audio playback, seconds
        this.playbackTime = 0;

        // timestamp of last playback start, milliseconds
        this.startTimestamp = 0;
        this.isPlaying      = false;

        // in seconds
        this.bufferDuration = 0;
    }

    initSource() {
        this.source.buffer  = this.buffer;
        this.source.onended = this.endOfPlayback;
    }

    initCanvas() {

        this.canvas = document.querySelector('canvas');
        this.canvas = this.canvas.getContext('2d');

        this.canvasGradient = this.canvas.createLinearGradient(0, 0, 0, 300);
        this.canvasGradient.addColorStop(1, '#000000');
        this.canvasGradient.addColorStop(0.75, '#ff0000');
        this.canvasGradient.addColorStop(0.25, '#ffff00');
        this.canvasGradient.addColorStop(0, '#ffffff');
    }

    play() {

        if (this.isPlaying)
            return false;

        this.initSource();

        this.source.start(0, this.playbackTime);

        this.startTimestamp = Date.now();

        this.isPlaying = true;
    }

    /**
     * @description Pause playback, keep track of where playback stopped
     *
     */
    pause() {
        this.stop(true);
    }

    /**
     * @param {Boolean} pause
     *
     * @description Stop or pause
     *
     */
    stop(pause) {

        if (!this.isPlaying)
            return false;

        // Set to flag to endOfPlayback callback that this was set manually
        this.isPlaying = false;
        this.source.stop(0);

        // If paused, calculate time where we stopped. Otherwise go back to beginning of playback (0).
        this.playbackTime = pause ? (Date.now() - this.startTimestamp) / 1000 + this.playbackTime : 0;
    }

    /**
     * @description Callback for any time playback stops/pauses
     *
     */
    endOfPlayback() {

        // If playback stopped because end of buffer was reached
        if (this.isPlaying)
            this.playbackTime = 0;

        this.isPlaying = false;
    }

    /**
     * @param {Object} event
     *
     * @fires Player#change
     */
    onFileChange(event) {

        var reader = new FileReader();
        reader.readAsArrayBuffer(event.target.files[0]);

        reader.onload = e => {

            this.load(e.target.result);
        };

        reader.onerror = e => {
            console.error('[onFileChange] error > ', e);
        };
    }

    /**
     * @param {String} url
     *
     */
    loadByUrl(url) {

        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // When loaded decode the data
        request.onload = () => {
            this.load(request.response);
        };

        request.send();
    }

    /**
     * @param {Object} arrayBuffer
     *
     */
    load(arrayBuffer) {

        if (this.source !== null)
            this.stop();

        this.init();

        this.context.decodeAudioData(arrayBuffer, buffer => {

            this.buffer = buffer;

            this.play();

        }, this.onError);
    }

    setup() {

        this.source = this.context.createBufferSource();
        this.source.connect(this.context.destination);

        // setup a javascript node
        this.analyserNode = this.context.createScriptProcessor(1024, 1, 1);

        // connect to destination, else it isn't called
        this.analyserNode.connect(this.context.destination);

        // setup a analyzer
        this.analyser = this.context.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.3;
        this.analyser.fftSize = 512;

        // create a buffer source node
        this.source = this.context.createBufferSource();
        this.source.connect(this.analyser);
        this.analyser.connect(this.analyserNode);

        this.source.connect(this.context.destination);

        this.analyserNode.onaudioprocess = function() {
            this.drawAnalyse();
        }.bind(this);
    }

    drawAnalyse() {

        // get the average for the first channel
        var array = new Uint8Array(this.analyser.frequencyBinCount);

        this.analyser.getByteFrequencyData(array);

        // clear the current state
        this.canvas.clearRect(0, 0, 1000, 325);

        this.canvas.fillStyle = this.canvasGradient;

        this.drawSpectrum(array);
    }

    /**
     * @param {Array} array
     *
     */
    drawSpectrum(array) {

        for (var i = 0; i < (array.length); i++)
            this.canvas.fillRect((i * 5), (325 - array[i]), 3, 325);
    }

    /**
     * @param {NodeElement} node
     *
     */
    listen(node) {

        node.addEventListener('change', this.onFileChange.bind(this));
    }

    /**
     * @param {Object} event
     *
     */
    onError(event) {

        console.error('[player] error >', event);
    }

    init() {

        this.context = new AudioContext();

        this.initCanvas();

        this.setup();
    }

}