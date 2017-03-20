import { Player } from './Player';

document.addEventListener('DOMContentLoaded', () => {

    var player = new Player();

    player.listen(
        document.querySelector('input[type="file"]')
    );
});