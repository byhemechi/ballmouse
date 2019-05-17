import Node from '../primitives/node.js';

/**
 * The main game class, a lot of logic will happen here
 */

class Game {
    el = document.createElement("canvas");
    ctx = this.el.getContext('2d');
    lt = 0;
    keys = {};

    root = new Node;
    /**
     * The main tick function, called every frame.
     * @param {Number} time Time in ms from the first run (not really but close enough)
     */

    constructor() {
        document.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;
        })
        document.addEventListener("keyup", (e) => {
            delete this.keys[e.key.toLowerCase()];
        })
    }
    tick(time) {
        const fps = 1000 / (time - this.lt);
        const delta = (time - this.lt) / 1000;
        this.fps = fps;
        this.lt = time;
        this.root.game = this;
        this.root.tick(delta);
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.el.width, this.el.height);
        this.root.render(ctx);
    }
}

export default Game;