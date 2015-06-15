var PLAYER = {};

PLAYER = function() {

    var $this = this;

    this.context = null;
    this.buffer = null;
    this.source = [];

    this.playbackTime = 0; // time of the audio playback, seconds
    this.startTimestamp = 0; // timestamp of last playback start, milliseconds
    this.isPlaying = false;
    this.bufferDuration = 0; // seconds

    // Create a new AudioBufferSourceNode
    this.initSource = function() {

        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.context.destination);

        // Bind the callback to this
        var endOfPlayback = this.endOfPlayback.bind(this);
        this.source.onended = endOfPlayback;
    }

    this.play = function() {

        if (this.isPlaying)
            return false;

        var when = 0; // when to schedule playback, 0 is immediately

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
        this.playbackTime = pause ? (Date.now() - this.startTimestamp)/1000 + this.playbackTime : 0;
    };

    // Callback for any time playback stops/pauses
    this.endOfPlayback = function(endEvent) {

      // If playback stopped because end of buffer was reached
      if (this.isPlaying)
          this.playbackTime = 0;

      this.isPlaying = false;
    }

    this.load = function(url) {

        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // When loaded decode the data
        request.onload = function() {

            // decode the data
            $this.context.decodeAudioData(request.response, function(buffer) {
                // when the audio is decoded play the sound

                $this.buffer = buffer;
            }, $this.onError);
        }
        request.send();
    };

    this.setup = function() {

        // create a buffer source node
        this.source = this.context.createBufferSource();

        // and connect to destination
        this.source.connect(this.context.destination);
    }

    this.onError = function(e) {
        console.error(e);
    };

    this.init = function() {
        this.context = new AudioContext();

        this.setup();
    };
};