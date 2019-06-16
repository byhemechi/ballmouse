// Import classes
import Entity from "../../primitives/entity.js";
import Sprite from "../../primitives/sprite.js";
import { Vector } from "../../types.js";
import Bullet from "../stopboat/bullet"


// Makes it so you dont need 'Math.' before math functions
const {sin, cos, tan, PI, random, abs, SQRT2, min, max, atan2} = Math;

export default class Player extends Entity {

    position = new Vector(48,324);

    speed = 420;

    weapons = [
        new Weapon
    ]

    children = [new Sprite({
        src: "/assets/flap/flap.png",
        size: new Vector(64, 64),
        position: new Vector(-32, -32),
        region: {
            begin: new Vector,
            size: new Vector(128, 128)
        }
    })]

    tick(delta) {

        var moveY = this.keyboardMove();

        this.position.y += moveY * this.speed * delta;

        // Clamp position
        this.clampPosition();

        if (this.game.keys.KeyZ) {
            this.shoot(600, 0);
        }

        super.tick(delta);
        
    }


    keyboardMove() {
        var move = 0;

        move -= this.game.keys.KeyI ? 1 : 0;
        move += this.game.keys.KeyK ? 1 : 0;

        return move;
    }

    clampPosition() {
        this.position.y = min(max(this.position.y, 0), 648);
    }

    shoot(speed, angle) {
        var bullet = new Bullet({
            speed: speed,
            angle: angle,
            size: new Vector(16,4)
        });
        bullet.position = this.position;
        this.parent.children.push(bullet)
    }

}