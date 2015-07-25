var Source = {};

Source = function(context, analyser) {

    var self = this;

    this.context = null;
    this.analyser = null;

    this.init = function(context, analyser) {

        this.context = context;
        this.analyser = analyser;

        this = this.context.createBufferSource();

        this.connect(this.analyser);
        this.connect(this.context.destination);
    };

    this.init(context, analyser);
};