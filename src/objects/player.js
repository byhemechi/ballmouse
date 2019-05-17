import Node from "../primitives/node.js";
import Rect from "../primitives/rect.js";
import { Vector } from "../types.js";

export default class Player extends Node {
    v = new Vector(0, 0);
    children = [new Rect({
        size: new Vector(20, 20)
    })]

    dir = {l: 0, r: 0}

    t = 0;
    tick(delta) {
        this.t += delta;
        const plus = new Vector;
        plus.x += this.game.keys.l ? 1 : 0;
        plus.x -= this.game.keys.j ? 1 : 0;
        plus.y += this.game.keys.k ? 1 : 0;
        plus.y -= this.game.keys.i ? 1 : 0;
        
        this.position = this.position.add(this.v.add(plus.multiply(200)).multiply(delta))
        super.tick(delta);
    }
}