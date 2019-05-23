import Game from "./base.js";
import Root from "../objects/flap/root.js";


export default class flap extends Game {
    score = 0;
    constructor() {
        super();
        this.root.children = [new Root];
        this.el.width  = 720;
        this.el.height = 480;
        this.el.style.backgroundColor = "skyblue"
    }
    render() {
        const ctx = this.ctx;
        super.render();
        ctx.font = "32px sans-serif"
        ctx.fillText(this.score, 100, 100);
    }
}