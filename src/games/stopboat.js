import Game from "./base.js";
import Root from "../objects/stopboat/root.js";


export default class Shootup extends Game {
    score = 0;
    constructor() {
        super();
        this.root.children = [new Root];
        this.el.width  = 1152;
        this.el.height = 648;
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