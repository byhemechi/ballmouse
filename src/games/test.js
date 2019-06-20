import Game from "./base";
import Player from "../objects/player";

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