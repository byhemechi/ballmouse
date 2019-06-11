import Game from './games/shootup.js';

const el = document.querySelector("#game");
const game = new Game;
el.appendChild(game.el);

/**
 * The entry render function, used only in this file for requestAnimationFrame
 * @param {number} time Time in ms since first frame rendered. This is automatically inserted by `requestAnimationFrame`
 */
function render(time) {
    game.tick(time);
    game.render();
    requestAnimationFrame(render);
}

requestAnimationFrame(render);

export {render}