import Entity from '../primitives/entity';

/**
 * The main game class, a lot of logic will happen here
 */

interface KeySet {
    [key: string]: boolean;
}

class Game {
    el: HTMLCanvasElement = document.createElement("canvas");
    ctx: CanvasRenderingContext2D = this.el.getContext('2d');
    lt = 0;
    keys: KeySet = {};
    delta: number;
    fps: number;

    root: Entity = new Entity({});
    /**
     * The main tick function, called every frame.
     * @param {Number} time Time in ms from the first run (not really but close enough)
     */

    constructor() {
        document.addEventListener("keydown", (e) => {
            this.keys[e.code] = true;
        })
        document.addEventListener("keyup", (e) => {
            delete this.keys[e.code];
        })
    }
    tick(time) {
        const fps = 1000 / (time - this.lt);
        const delta = Math.min(2, (time - this.lt) / 1000);
        this.delta = delta;
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