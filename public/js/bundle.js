var AudioSpectrum =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Player = __webpack_require__(1);

	document.addEventListener('DOMContentLoaded', function () {

	    var player = new _Player.Player();

	    player.listen(document.querySelector('input[type="file"]'));
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Player = exports.Player = function () {

	    /**
	     *
	     * @constructor
	     */
	    function Player() {
	        _classCallCheck(this, Player);

	        this.canvas = null;

	        this.context = null;
	        this.buffer = null;
	        this.source = null;

	        this.analyser = null;
	        this.analyserNode = null;

	        // time of the audio playback, seconds
	        this.playbackTime = 0;

	        // timestamp of last playback start, milliseconds
	        this.startTimestamp = 0;
	        this.isPlaying = false;

	        // in seconds
	        this.bufferDuration = 0;
	    }

	    /**
	     * @method
	     *
	     */


	    _createClass(Player, [{
	        key: 'initSource',
	        value: function initSource() {
	            this.source.buffer = this.buffer;
	            this.source.onended = this.endOfPlayback;
	        }

	        /**
	         * @method
	         *
	         */

	    }, {
	        key: 'initCanvas',
	        value: function initCanvas() {

	            this.canvas = document.querySelector('canvas');
	            this.canvas = this.canvas.getContext('2d');

	            this.canvasGradient = this.canvas.createLinearGradient(0, 0, 0, 300);
	            this.canvasGradient.addColorStop(1, '#000000');
	            this.canvasGradient.addColorStop(0.75, '#ff0000');
	            this.canvasGradient.addColorStop(0.25, '#ffff00');
	            this.canvasGradient.addColorStop(0, '#ffffff');
	        }

	        /**
	         * @method
	         *
	         */

	    }, {
	        key: 'play',
	        value: function play() {

	            if (this.isPlaying) return false;

	            this.initSource();

	            this.source.start(0, this.playbackTime);

	            this.startTimestamp = Date.now();

	            this.isPlaying = true;
	        }

	        /**
	         * @description Pause playback, keep track of where playback stopped
	         *
	         */

	    }, {
	        key: 'pause',
	        value: function pause() {
	            this.stop(true);
	        }

	        /**
	         * @param {Boolean} pause
	         *
	         * @description Stop or pause
	         *
	         */

	    }, {
	        key: 'stop',
	        value: function stop(pause) {

	            if (!this.isPlaying) return false;

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

	    }, {
	        key: 'endOfPlayback',
	        value: function endOfPlayback() {

	            // If playback stopped because end of buffer was reached
	            if (this.isPlaying) this.playbackTime = 0;

	            this.isPlaying = false;
	        }

	        /**
	         * @param {Object} event
	         *
	         * @fires Player#change
	         */

	    }, {
	        key: 'onFileChange',
	        value: function onFileChange(event) {
	            var _this = this;

	            var reader = new FileReader();
	            reader.readAsArrayBuffer(event.target.files[0]);

	            reader.onload = function (e) {

	                _this.load(e.target.result);
	            };

	            reader.onerror = function (e) {
	                console.error('[onFileChange] error > ', e);
	            };
	        }

	        /**
	         * @param {String} url
	         *
	         */

	    }, {
	        key: 'loadByUrl',
	        value: function loadByUrl(url) {
	            var _this2 = this;

	            var request = new XMLHttpRequest();
	            request.open('GET', url, true);
	            request.responseType = 'arraybuffer';

	            // When loaded decode the data
	            request.onload = function () {
	                _this2.load(request.response);
	            };

	            request.send();
	        }

	        /**
	         * @param {Object} arrayBuffer
	         *
	         */

	    }, {
	        key: 'load',
	        value: function load(arrayBuffer) {
	            var _this3 = this;

	            if (this.source !== null) this.stop();

	            this.init();

	            this.context.decodeAudioData(arrayBuffer, function (buffer) {

	                _this3.buffer = buffer;

	                _this3.play();
	            }, this.onError);
	        }

	        /**
	         * @method
	         *
	         */

	    }, {
	        key: 'setup',
	        value: function setup() {

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

	            this.analyserNode.onaudioprocess = function () {
	                this.drawAnalyse();
	            }.bind(this);
	        }

	        /**
	         * @method
	         *
	         */

	    }, {
	        key: 'drawAnalyse',
	        value: function drawAnalyse() {

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

	    }, {
	        key: 'drawSpectrum',
	        value: function drawSpectrum(array) {

	            for (var i = 0; i < array.length; i++) {
	                this.canvas.fillRect(i * 5, 325 - array[i], 3, 325);
	            }
	        }

	        /**
	         * @param {NodeElement} node
	         *
	         * @example
	         * var player = new Player;
	         *
	         * player.listen(document.querySelector('input[type="file"]') );
	         *
	         * @listens Player#change
	         */

	    }, {
	        key: 'listen',
	        value: function listen(node) {

	            node.addEventListener('change', this.onFileChange.bind(this));
	        }

	        /**
	         * @param {Object} event
	         *
	         * @fires Player#error
	         */

	    }, {
	        key: 'onError',
	        value: function onError(event) {

	            console.error('[player] error >', event);
	        }

	        /**
	         * @method
	         *
	         */

	    }, {
	        key: 'init',
	        value: function init() {

	            this.context = new AudioContext();

	            this.initCanvas();

	            this.setup();
	        }
	    }]);

	    return Player;
	}();

/***/ }
/******/ ]);