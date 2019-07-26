import Entity from "../../primitives/entity";
import Sprite from "../../primitives/sprite";
import Rect from "../../primitives/rect";
import { Vector } from "../../types";

// Makes it so you dont need 'Math.' before math functions

/**
 * Basic Bullet class. Most projectiles will be using this class.
 */

/**
 * Bullet Class
 * @extends Entity
 * @param options Options for the Entity; See below
 * @param options.src Path or image of bullet
 * @param options.imgSize Size of image
 * @param options.speed Speed of the bullet
 * @param options.angle Angle that the bullet travels in radians clockwise
 * @param options.direction
 * @param options.damage How much damage the bullet does
 */

export default class Bullet extends Entity {

    speed: number;
    angle: number;
    damage: number;
    direction: Vector;

    constructor(options) {
        super(options);
        this.speed = options.speed;
        this.angle = options.angle;
        this.direction = options.direction;
        this.damage = options.damage;
        this.children = [new Sprite({
            src: options.src,
            size: options.imgSize,
            position: options.imgSize.multiply(-0.5)
        })];
    }
    

    tick(delta) {

        this.position.x += this.direction.x * this.speed * delta;
        this.position.y += this.direction.y * this.speed * delta;
        // this.clear();

        super.tick(delta);
    }
    /**
     * Check if this bullet is offscreen
     */
    isOffscreen() {
        if (this.position.x > 1124 ||
            this.position.x < -100 ||
            this.position.y > 576 ||
            this.position.y < 0) {
            return true;
        } else {
            return false;
        }
    }

    clear() {
        if (this.isOffscreen() || this.damage <= 0) {
            this.free()
        }
    }
}