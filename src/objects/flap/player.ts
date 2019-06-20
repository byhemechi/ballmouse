// Import classes
import Entity from "../../primitives/entity";
import Sprite from "../../primitives/sprite";
import { Vector } from "../../types";

const gravity = 1700;

export default class Player extends Entity {
    v = new Vector(0, 0); // Velocity variable   

    alive = true;
    
    jumpJustPressed: boolean = false;

    player = new Sprite({
        src: "/assets/flap/flap.png",
        size: new Vector(64, 64),
        position: new Vector(-32, -32),
        region: {
            begin: new Vector,
            size: new Vector(128, 128)
        }
    });

    hoverboardSprites = new Sprite({
        src: '/assets/hoverbored/coolguy.png',
        size: new Vector(32, 34),
        position: new Vector(-16, -23),
        visible: false,
        region: {
            begin: new Vector(0, 0),
            size: new Vector(64, 68)
        },
        children: [new Entity({
            position: new Vector(16, 17),
            children: [
                new Sprite({
                    src: "/assets/hoverbored/hand.png",
                    position: new Vector(22, -4),
                    size: new Vector(36 * 0.75, 18 * 0.75),
                }),
                new Sprite({
                    src: "/assets/hoverbored/hand2.png",
                    position: new Vector(-49, -4),
                    size: new Vector(27, 13),
                }),
                new Sprite({
                    src: "/assets/hoverbored/hoverboard.png",
                    position: new Vector(-58.75/2, 24),
                    size: new Vector(47*1.25, 16),
                })
            ]
        })]
    })

    children = [this.player, this.hoverboardSprites]

    size = new Vector(0, 0); // Hitbox size
    const 

    state = 0;    // Player state, 0: Flappy Bird, 1: Copter

    // Called when Player is created
    constructor(...args) {
        super(...args);
        this.reset();
    }

    kill() {
        this.root.started = false;
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
            this.children[0].visible = true;
            this.hoverboardSprites.visible = false;

            this.v.y += gravity * delta;
            if (this.jumpJustPressed) {
                this.v.y = -600;
            }
            // Set the correct frame
            if(this.v.y < 0) this.children[0].region.begin.x = 128
            else this.children[0].region.begin.x = 0
            
        }
        // Copter
        else if (this.state == 1) {
            this.children[0].visible = false;
            this.hoverboardSprites.visible = true;
            this.v.y = this.game.keys.Space ? -400 : 400;
            this.hoverboardSprites.children[0].rotation += ((this.game.keys.Space ? -0.3 : 0.3) - this.hoverboardSprites.children[0].rotation) / 5
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