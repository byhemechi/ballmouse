import Game from "./base.js";
import Root from "../objects/flap/root.js";


export default class test extends Game {

    constructor() {
        super();
        this.root.children = [new Root];
        this.el.width  = 720;
        this.el.height = 480;
    }
    render() {
        super.render();
        const ctx = this.ctx;
    }
}