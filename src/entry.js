import Game from './game.js';

const el = document.querySelector("#game");
const game = new Game;
el.appendChild(game.el);

function render(time) {
    game.tick(time);
    game.render();
    requestAnimationFrame(render);
}

requestAnimationFrame(render);