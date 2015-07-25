var Panel = {};

Panel = function(selector) {

    var self = this;

    var item = null;

    this.init = function(selector) {

        this.item = document.querySelector(selector);

        this.item.querySelector('input[type="file"]').addEventListener('change', player.onFileChange.bind(null, player.load), false);
        /*
        this.item.querySelector('input[type="file"]').onchange = function() {
            console.log(this);
            player.loadByUpload(this);
        };
        */
    };

    this.init(selector);
};