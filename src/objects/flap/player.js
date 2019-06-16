// Import classes
import Entity from "../../primitives/entity.js";
import Sprite from "../../primitives/sprite.js";
import { Vector } from "../../types.js";

const gravity = 1700;

export default class Player extends Entity {
    v = new Vector(0, 0); // Velocity variable   

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
        this.reset();
    }

    kill() {
        this.parent.started = false;
        this.alive = false;
    }

    /**
     * (Re)sets the player to the starting state
     */
    reset() {
        this.position.x = 200;
        this.position.y = 200;
        this.v.y = -600;
        this.alive = true;
    }

    // Called every frame
    tick(delta) {

        // Flappy Bird
        if (this.state == 0){
            this.v.y += gravity * delta;
            if (this.parent.jumpJustPressed) {
                this.v.y = -600;
            }
            // Set the correct frame
            if(this.v.y < 0) this.children[0].region.begin.x = 128
            else this.children[0].region.begin.x = 0
            
        }
        // Copter
        else if (this.state == 1) {
            this.v.y = this.game.keys.Space ? -400 : 400;
        }

        // Clamp y velocity
        this.v.y = Math.min(Math.max(this.v.y, -800), 800);

       
        // If player is alive, move the player
        if (this.alive && this.parent.started) {
            this.position = this.position.add(this.v.multiply(delta))
        }

        // If player is dead, when jump is pressed, reset game
        else if (!this.alive) {
            this.kill();

        }

        // Engine stuff, you must have this in tick() function
        super.tick(delta);
    }
}