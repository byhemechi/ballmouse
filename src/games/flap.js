import Game from "./base.js";
import Player from "../objects/flap/player.js";

export default class test extends Game {
    constructor() {
        super();
        this.root.children = [new Player];
        this.el.width  = 720;
        this.el.height = 480;
    }

    render() {
        super.render();
        const ctx = this.ctx;
    }
}