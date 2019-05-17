import Game from "./base.js";
import Player from "../objects/player.js";

export default class test extends Game {
    constructor() {
        super()
        this.root.children = [new Player];
        this.el.width  = 400;
        this.el.height = 700;
    }

    render() {
        super.render();
        const ctx = this.ctx;
    }
}