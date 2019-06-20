<<<<<<< Updated upstream:src/games/stopboat.js
import Game from "./base.js";
import Root from "../objects/flap/root.js";
=======
import Game from "./base.ts";
import Root from "../objects/stopboat/root.js";
>>>>>>> Stashed changes:src/games/stopboat.ts


export default class Shootup extends Game {
    score: number = 0;
    root: Root = new Root;
    
    constructor() {
        super();
<<<<<<< Updated upstream:src/games/stopboat.js
        this.root.children = [new Root];
        this.el.width  = 420;
        this.el.height = 666;
=======
        this.el.width  = 1024;
        this.el.height = 576;
>>>>>>> Stashed changes:src/games/stopboat.ts
        this.el.style.backgroundColor = "black";
    }
    render() {
        const ctx = this.ctx;
        super.render();
        ctx.font = "32px sans-serif"
        ctx.fillStyle = "#bada55";
        ctx.fillText(this.score, 100, 100);
    }
}