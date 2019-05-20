import Node from "../../primitives/node.js";
import Rect from "../../primitives/rect.js";
import { Vector } from "../../types.js";

const gravity = 9;

export default class Player extends Node {
    v = new Vector(0, 0);

    prevUp = false;
    upJustPressed = false;

    children = [new Rect({
        size: new Vector(20, 20)
    })]

    dir = {l: 0, r: 0}

    t = 0;

    constructor(...args) {
        super(...args);
        this.position.x = 100;
    }

    tick(delta) {
        console.log(this.game.keys.)
        if (this.game.keys.space && !this.prevUp) {
            this.upJustPressed = true;
        }
        else {
            this.upJustPressed = false;
        }
        this.prevUp = this.game.keys.space;

        this.t += delta;

        this.v.y += gravity * delta;

        if (this.upJustPressed) {
            this.v.y = -3;
        }
        
        this.position = this.position.add(this.v.multiply(200 * delta))
        super.tick(delta);
    }
}