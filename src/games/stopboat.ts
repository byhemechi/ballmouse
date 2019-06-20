import Game from "./base.ts";
import Root from "../objects/stopboat/root.ts";


export default class Shootup extends Game {
    score: number = 0;
    root: Root = new Root;
    
    constructor() {
        super();
        this.el.width  = 1024;
        this.el.height = 576;
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