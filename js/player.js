var Player = {};

Player = function() {

    var $this = this;

    this.canvas = null;

    this.context = null;
    this.buffer = null;
    this.source = null;

    this.analyser = null;
    this.analyserNode = null;

    this.playbackTime = 0; // time of the audio playback, seconds
    this.startTimestamp = 0; // timestamp of last playback start, milliseconds
    this.isPlaying = false;
    this.bufferDuration = 0; // seconds

    // Create a new AudioBufferSourceNode
    this.initSource = function() {

        this.source.buffer = this.buffer;

        // Bind the callback to this
        var endOfPlayback = this.endOfPlayback.bind(this);
        this.source.onended = endOfPlayback;
    };

    this.initCanvas = function() {

        this.canvas = document.querySelector('canvas');
        this.canvas = this.canvas.getContext('2d');

        this.canvasGradient = this.canvas.createLinearGradient(0, 0, 0, 300);
        this.canvasGradient.addColorStop(1, '#000000');
        this.canvasGradient.addColorStop(0.75, '#ff0000');
        this.canvasGradient.addColorStop(0.25, '#ffff00');
        this.canvasGradient.addColorStop(0, '#ffffff');
    };

    this.play = function() {

        if (this.isPlaying)
            return false;

        this.initSource();

        this.source.start(0, this.playbackTime);

        this.startTimestamp = Date.now();

        this.isPlaying = true;
    };

    // Pause playback, keep track of where playback stopped
    this.pause = function() {
        this.stop(true);
    };

    // stop or pause
    this.stop = function(pause) {

        if (!this.isPlaying)
            return false;

        // Set to flag to endOfPlayback callback that this was set manually
        this.isPlaying = false;
        this.source.stop(0);

        // If paused, calculate time where we stopped. Otherwise go back to beginning of playback (0).
        this.playbackTime = pause ? (Date.now() - this.startTimestamp) / 1000 + this.playbackTime : 0;
    };

    // Callback for any time playback stops/pauses
    this.endOfPlayback = function(endEvent) {

        // If playback stopped because end of buffer was reached
        if (this.isPlaying)
            this.playbackTime = 0;

        this.isPlaying = false;
    };

    this.onFileChange = function(then, event) {

        var reader = new FileReader();
        reader.readAsArrayBuffer(event.target.files[0]);

        $this.panel = event.target.closest('.panel');

        reader.onload = function (e) {
            then(e.target.result);
        };

        reader.onerror = function (e) {
            console.error('[onFileChange]', e);
        };
    };

    this.loadByUrl = function(url) {

        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // When loaded decode the data
        request.onload = function() {
            $this.load(request.response);
        };

        request.send();
    };

    this.load = function(arrayBuffer) {

        if ($this.source !== null)
            $this.source.stop();

        $this.init();

        $this.context.decodeAudioData(arrayBuffer, function(buffer) {

            $this.buffer = buffer;

            $this.play();

        },  $this.onError);
    };

    this.setup = function() {

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
            $this.drawAnalyse();
        };
    };

    this.drawAnalyse = function() {

        // get the average for the first channel
        var array = new Uint8Array(this.analyser.frequencyBinCount);

        this.analyser.getByteFrequencyData(array);

        // clear the current state
        this.canvas.clearRect(0, 0, 1000, 325);

        this.canvas.fillStyle = this.canvasGradient;

        this.drawSpectrum(array);
    };

    this.drawSpectrum = function(array) {

        for (var i = 0; i < (array.length); i++)
            this.canvas.fillRect((i * 5), (325 - array[i]), 3, 325);
    };

    this.onError = function(e) {
        console.error('[player]', e);
    };

    this.init = function() {

        this.context = new AudioContext();

        this.initCanvas();

        this.setup();
    };
};