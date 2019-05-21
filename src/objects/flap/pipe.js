import Node from "../../primitives/node.js";
import Rect from "../../primitives/rect.js";
import { Vector } from "../../types.js";

export default class Pipe extends Node {
    size = new Vector(50, 500);

    children = [new Rect({
        size: new Vector(50, 500),
        fill: "#0f0;"
    })]

    constructor(...args) {
        super(...args);
        this.position.x = 720;
    }

    tick(delta) {
        this.position.x -= this.parent.speed * delta;
        
        super.tick(delta);
    }
    
}