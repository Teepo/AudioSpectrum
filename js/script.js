var player = null;
var panel = null;

$(document).ready(function() {

    player = new Player();

    //player.init();

    var panelLeft = new Panel('.panel.left');
    var panelRight = new Panel('.panel.right');

    //player.load("http://localhost:8888/assets/sounds/DJ SMALOUM - far out_210127872_soundcloud.mp3");
    //player.load('http://localhost:8888/assets/sounds/wagner-short.ogg');
});
