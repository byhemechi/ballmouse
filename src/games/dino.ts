import Game from "./base";
import Root from "../objects/dino/root";


export default class Dino extends Game {
    score: number = 0;
    root: Root = new Root({});
    
    constructor() {
        super();
        this.el.width  = 1024;
        this.el.height = 576;
        this.el.style.backgroundColor = "white";
    }
    render() {
        const ctx = this.ctx;
        super.render();
        ctx.font = "32px sans-serif"
        ctx.fillStyle = "#bada55";
        ctx.fillText(this.score.toString(), 100, 100);
    }
}