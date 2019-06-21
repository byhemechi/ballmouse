// Import classes
import Entity from "../../primitives/entity";
import Rect from "../../primitives/rect";
import { Vector } from "../../types";
import Sprite from "../../primitives/sprite";

export default class Pipe extends Entity {
    size = new Vector(64, 500); // Hitbox size
    isFree = false; // Flag if the current pipe is active or not

    children = []

    // Called when Pipe is created
    constructor(...args) {
        super(...args);
        this.position.x = 720;
        this.children.push(new Sprite({
            src: "/assets/flap/pipe.png"
        }))
    }

    // Called every frame
    tick(delta) {
        // Move pipe
        if (!this.isFree) {
            this.position.x -= this.parent.parent.speed * delta;
        }

        // Flag as free if we are below x:-100
        if (this.position.x < -100) {
            this.isFree = true;
            this.visible = false;
        }  
        
        // Engine stuff, you must have this in tick() function
        super.tick(delta);
    }
}