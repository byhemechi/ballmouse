// Import classes
import Entity from "../../primitives/entity";
import Sprite from "../../primitives/sprite";
import { Vector } from "../../types";
import { getSound, playSound } from "../../sound";

export default class Player extends Entity {
    velocity = 0;

    gravity = 1700;
    copterSpeed = 1700;
    copterGravity = 1500;

    alive = true;

    sounds: Object = {};

    flapSound: ArrayBuffer;

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
                    position: new Vector(-58.75 / 2, 24),
                    size: new Vector(47 * 1.25, 16),
                })
            ]
        })]
    })

    children = [this.player, this.hoverboardSprites]

    size = new Vector(0, 0); // Hitbox size

    state: number = 0;    // Player state, 0: Flappy Bird, 1: Copter

    // Called when Player is created
    constructor(...args) {
        super(...args);
        this.reset();
        getSound("point", "/assets/flap/point.wav");
        getSound("flap", "/assets/flap/flap.wav");
        getSound("death", "/assets/flap/death.wav");
    }

    kill() {
        if (this.alive) {
            this.alive = false;
            playSound("death");
            this.velocity = -600;
            this.hoverboardSprites.visible = false;
            this.player.visible = true;
            this.player.region.begin.x = 256;
        }
    }

    /**
     * (Re)sets the player to the starting state
     */
    reset() {
        this.position.x = 200;
        this.position.y = 200;
        this.velocity = -600;
        this.rotation = 0;
        this.alive = true;
        this.state = 0;
    }

    // Called every frame
    tick(delta) {

        if (this.alive && this.parent.started) {
            if (this.state == 0) this.flapMode(delta);
            else if (this.state == 1) this.copterMode(delta);
            
            // Clamp y velocity
            this.velocity = Math.min(Math.max(this.velocity, -600), 600);
        }

        else if (!this.alive){
            this.deadMode(delta);
        }
        super.tick(delta);
    }

    updateCopterVelocity(delta) {
        if (this.game.keys.Space) {
            if (this.velocity > 0) {
                this.velocity -= 1.25 * 0.5 * this.copterSpeed * delta;
            }
            else {
                this.velocity -= 0.5 * this.copterSpeed * delta;
            }
        }
        else {
            if (this.velocity < 0) {
                this.velocity += 1.25 * 0.5 * this.copterGravity * delta;
            }
            else {
                this.velocity += 0.5 * this.copterGravity * delta;
            }
        }
    }

    flapMode(delta) {
        this.player.visible = true;
            this.hoverboardSprites.visible = false;

            this.velocity += 0.5 * this.gravity * delta;

            if (this.jumpJustPressed) {
                this.velocity = -600;
                playSound("flap");
            }

            this.position.y += this.velocity * delta;

            this.velocity += 0.5 * this.gravity * delta;

            // Set the correct frame
            if (this.velocity < 0) this.player.region.begin.x = 128
            else this.player.region.begin.x = 0
    }

    copterMode(delta) {
        this.player.visible = false;
            this.hoverboardSprites.visible = true;
            this.hoverboardSprites.children[0].rotation += ((this.game.keys.Space ? -0.3 : 0.3) - this.hoverboardSprites.children[0].rotation) / 5

            this.updateCopterVelocity(delta);
            this.position.y += this.velocity * delta;
            this.updateCopterVelocity(delta);
    }

    deadMode(delta) {
        this.velocity += 0.5 * this.gravity * delta;
            this.position.y += this.velocity * delta;
            this.velocity += 0.5 * this.gravity * delta;

            this.rotation += delta * 4;
    }
}