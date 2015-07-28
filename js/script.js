var player = null;
var panel = null;

$(document).ready(function() {

    player = new Player();

    document.querySelector('input[type="file"]').addEventListener('change', player.onFileChange.bind(null, player.load), false);

    //player.load("http://localhost:8888/assets/sounds/DJ SMALOUM - far out_210127872_soundcloud.mp3");
    //player.load('http://localhost:8888/assets/sounds/wagner-short.ogg');
});
