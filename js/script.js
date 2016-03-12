$(document).ready(function() {

    var player = new Player();

    player.listen(
        document.querySelector('input[type="file"]')
    );

    //player.load("http://localhost:8888/assets/sounds/DJ SMALOUM - far out_210127872_soundcloud.mp3");
    //player.load('http://localhost:8888/assets/sounds/wagner-short.ogg');
});
