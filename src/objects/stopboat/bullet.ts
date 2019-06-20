import Entity from "../../primitives/entity";
import Sprite from "../../primitives/sprite";
import Rect from "../../primitives/rect";
import { Vector } from "../../types";

// Makes it so you dont need 'Math.' before math functions
const {sin, cos, tan, PI, random, abs, SQRT2, min, max, atan2} = Math;

/**
 * Basic Bullet class. Most projectiles will be using this class.
 */

/**
 * Bullet Class
 * @extends Entity
 * @param {Object}  options         Options for the Entity; See below
 * @param {Vector}  options.size    Size of bullet hitbox
 * @param {string}  options.src     Path or image of bullet
 * @param {Vector}  options.imgsize Size of image
 * @param {number}  options.speed   Speed of the bullet
 * @param {number}  options.angle   Angle that the bullet travels in radians clockwise
 */

export default class Bullet extends Entity {

    size: Vector;
    speed: number;
    angle: number;

    constructor(options) {
        super(options);
        this.size = options.size || new Vector(0,0);
        this.speed = options.speed;
        this.angle = options.angle;
    }

    children = [new Rect({
        position: this.size.multiply(-0.5),
        size: this.size,
        fill: '#ffffff'
    })]

    tick(delta) {
        this.position = this.position.add(
            new Vector(
                cos(this.angle), 
                sin(this.angle)
            ).multiply(this.speed * delta)
        )

        super.tick(delta);
    }
    /**
     * Check if this bullet is offscreen
     */
    isOffscreen() {
        if (this.position.x > this.game.el.width ||
            this.position.x < 0 ||
            this.position.y > this.game.el.height ||
            this.position.y < 0) {
            return true
        }
    }
}