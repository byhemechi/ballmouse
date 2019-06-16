import Game from "./base.js";
import Root from "../objects/flap/root.js";


export default class Shootup extends Game {
    score = 0;
    constructor() {
        super();
        this.root.children = [new Root];
        this.el.width  = 420;
        this.el.height = 666;
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