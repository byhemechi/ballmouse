// Import classes
import Entity from "../../primitives/entity.js";
import Sprite from "../../primitives/sprite.js";
import { Vector } from "../../types.js";
import Bullet from './bullet'
import PlayerBullet from "./bullet/playerbullet.js";

// Makes it so you dont need 'Math.' before math functions
const {sin, cos, tan, PI, random, abs, SQRT2, min, max, atan2} = Math;

export default class Player extends Entity {
    
    unfocusedSpeed = 250;
    focusSpeed = 125;
    
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
        var speed = this.unfocusedSpeed;
        var move = new Vector;

        speed = this.keyboardMove(move, speed);

        const angle = atan2(move.y, move.x);
        const isMoving = abs(move.x) || abs(move.y);
        move.x = isMoving ? cos(angle) : 0;
        move.y = isMoving ? sin(angle) : 0;


        this.position = this.position.add(move.multiply(speed * delta));

        // Clamp position
        this.clampPosition();

        if (this.game.keys.KeyZ) {
            this.shoot();
        }

        super.tick(delta);
        
    }

    keyboardMove(move, speed) {
        if (this.game.keys.KeyI) {
            move.y -= 1;
        }
        ;
        if (this.game.keys.KeyK) {
            move.y += 1;
        }
        ;
        if (this.game.keys.KeyJ) {
            move.x -= 1;
        }
        ;
        if (this.game.keys.KeyL) {
            move.x += 1;
        }
        ;
        if (this.game.keys.ShiftLeft) {
            speed = this.focusSpeed;
        }
        return speed;
    }

    clampPosition() {
        this.position.x = min(max(this.position.x, 0), 420);
        this.position.y = min(max(this.position.y, 0), 666);
    }

    shoot() {
        const bullet = new PlayerBullet;
        this.children.push(bullet);
    }
}