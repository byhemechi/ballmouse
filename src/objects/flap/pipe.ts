// Import classes
import Entity from "../../primitives/entity";
import Rect from "../../primitives/rect";
import { Vector } from "../../types";
import Sprite from "../../primitives/sprite";
import { copySync } from "fs-extra";

export default class Pipe extends Entity {
    size = new Vector(64, 500); // Hitbox size
    isFree = false; // Flag if the current pipe is active or not
    
    speedY: number = 0; // Move pipe 

    children = [
        new Entity({
            children: [
                new Sprite({
                    src: '/assets/flap/pipe.png',
                    position: new Vector(-6, 0)
        })]}),
        new Entity({
            children: [
                new Sprite({
                    src: '/assets/flap/minipipe.png',
                    position: new Vector(-3, 0)
        })]})
    ]

    // Called when Pipe is created
    constructor(...args) {
        super(...args);
        this.position.x = 720;
    }

    // Called every frame
    tick(delta) {
        // Move pipe by speed
        if (!this.isFree) this.position.x -= this.parent.parent.speed * delta;

        this.position.y += this.speedY * delta;

        // Flag as free if we are below x:-100
        if (this.position.x < -100) {
            this.free();            
            this.visible = false;
            this.speedY = 0;
        }

        // Engine stuff, you must have this in tick() function
        super.tick(delta);
    }
}