// Import classes
import Node from "../../primitives/node.js";
import Rect from "../../primitives/rect.js";
import { Vector } from "../../types.js";

export default class Pipe extends Node {
    size = new Vector(64, 500); // Hitbox size
    free = false; // Flag if the current pipe is active or not

    children = [new Rect({
        size: new Vector(64, 50),
        fill: "#19c167"
    })]

    // Called when Pipe is created
    constructor(...args) {
        super(...args);
        this.position.x = 720;
    }

    // Called every frame
    tick(delta) {
        // Move pipe
        if (!this.free) {
            this.position.x -= this.parent.speed * delta;
        }

        // Flag as free if we are below x:-100
        if (this.position.x < -100) {
            this.free = true;
        }  
        
        // Engine stuff, you must have this in tick() function
        super.tick(delta);
    }
}