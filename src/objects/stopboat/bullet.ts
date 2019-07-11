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
 * @param options -          Options for the Entity; See below
 * @param options.src -      Path or image of bullet
 * @param options.imgsize -  Size of image
 * @param options.speed -    Speed of the bullet
 * @param options.angle -    Angle that the bullet travels in radians clockwise
 * @param options.damage -   How much damage the bullet does
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
        this.damage = options.damage;
    }

    children = [new Sprite({
        src: "/assets/stopboat/bullet.png",
        position: new Vector(-37 / 2, -5 / 2)
    })]

    tick(delta) {
        this.position.x += this.direction.x * this.speed * delta;
        this.position.y += this.direction.y * this.speed * delta;

        this.clear();

        super.tick(delta);
    }
    /**
     * Check if this bullet is offscreen
     */
    isOffscreen() {
        if (this.position.x > 1024 ||
            this.position.x < 0 ||
            this.position.y > 576 ||
            this.position.y < 0) {
            return true
        }
    }

    clear() {
        if (this.isOffscreen()) this.free()
    }
}