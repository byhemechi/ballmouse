import {Node, Rect} from './primitives.js';
import { Vector } from './types.js';

/**
 * The main game class, a lot of logic will happen here
 */
class Game {
    el = document.createElement("canvas");
    ctx = this.el.getContext('2d');
    lt = 0;

    root = new Node;
    constructor() {
        this.root.children.push(new Rect({
            width: 30,
            height: 40,
            position: new Vector(20, 20)
        }))
    }
    /**
     * The main tick function, called every frame.
     * @param {Number} time Time in ms from the first run (not really but close enough)
     */
    tick(time) {
        const fps = 1000 / (time - this.lt);
        const delta = 60 / fps;
        this.fps = fps;
        this.lt = time;
    }

    render() {
        const ctx = this.ctx;

        ctx.clearRect(0, 0, this.el.width, this.el.height);

        this.root.render(ctx);
    }
}

export default Game;