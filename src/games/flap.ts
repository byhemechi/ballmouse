import Game from "./base";
import Root from "../objects/flap/root";


export default class flap extends Game {
    root: Root;
    score: number = 0;
    constructor() {
        super();
        this.root.children = [new Root];
        this.el.width  = 720;
        this.el.height = 480;
        this.el.style.backgroundColor = 'skyblue';
    }
    render() {
        const ctx = this.ctx;
        super.render();
        ctx.font = "32px sans-serif"
        ctx.fillText(this.score.toString(), 100, 100);
    }
    tick(time) {
        super.tick(time);
    }
}