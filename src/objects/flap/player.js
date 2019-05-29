// Import classes
import Node from "../../primitives/node.js";
import Sprite from "../../primitives/sprite.js";
import { Vector } from "../../types.js";

const gravity = 1700;

export default class Player extends Node {
    v = new Vector(0, 0); // Velocity variable

    prevJump = false; // Space state on last frame
    jumpJustPressed = false;

    alive = true;

    children = [new Sprite({
        src: "/assets/flap/flap.png",
        size: new Vector(64, 64),
        position: new Vector(-32, -32),
        region: {
            begin: new Vector,
            size: new Vector(128, 128)
        }
    })]

    size = new Vector(0, 0); // Hitbox size

    state = 0;    // Player state, 0: Flappy Bird, 1: Copter

    // Called when Player is created
    constructor(...args) {
        super(...args);
        this.position.x = 200;
        this.position.y = 200;
        this.v.y = -600;
    }

    // Called every frame
    tick(delta) {
        
        // Input if jump pressed this frame
        if (this.game.keys.Space && !this.prevJump) {
            this.jumpJustPressed = true;
        }
        else {
            this.jumpJustPressed = false;
        }
        this.prevJump = this.game.keys.Space;

        this.v.y += gravity * delta;

        // Flappy Bird
        if (this.state == 0){
            // Set the correct frame
            if(this.v.y < 0) this.children[0].region.begin.x = 128
            else this.children[0].region.begin.x = 0
            if (this.jumpJustPressed) {
                this.v.y = -600;
            }
        }
        // Copter
        else if (this.state == 1) {
            this.children[0].fill = "#ff3245"; // Change colour
            if (this.game.keys.Space) {
                this.v.y -= gravity * delta * 2.4; // Go up if space is pressed
                // If we are going down, we accelerate up faster
                if (this.v.y > 0) {         
                    this.v.y -= gravity * delta / 2;
                }
            }
            else {
                if (this.v.y < 0) {
                    this.v.y += gravity * delta / 2
                }
            }
        }

        // Clamp y velocity
        this.v.y = Math.min(Math.max(this.v.y, -800), 800);

       
        // If player is alive, move the player
        if (this.alive) {
            this.position = this.position.add(this.v.multiply(delta))
        }
        // If player is dead, when jump is pressed, reset game
        else {
            if (this.jumpJustPressed) {
                // Replace later
                location.reload();
            }
        }

        // Engine stuff, you must have this in tick() function
        super.tick(delta);
    }
}