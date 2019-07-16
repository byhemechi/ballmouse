import Game from "./base";
import Root from "../objects/stopboat/root";


export default class Shootup extends Game {
    score: number = 0;
    root: Root = new Root({});
    
    constructor() {
        super();
        this.el.width  = 1024;
        this.el.height = 576;
        this.el.style.backgroundColor = "#275a75";
    }
    render() {
        const ctx = this.ctx;
        super.render();
        ctx.font = "32px sans-serif"
        ctx.fillStyle = "#bada55";
        ctx.fillText(this.score.toString(), 100, 100);
    }
}