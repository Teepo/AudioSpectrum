var player = null;

$(document).ready(function() {

    player = new PLAYER();

    player.init();

    player.load("http://localhost:8888/assets/sounds/DJ SMALOUM - far out (demo)_210127872_soundcloud.mp3")
    //player.load('http://localhost:8888/assets/sounds/wagner-short.ogg');
});
