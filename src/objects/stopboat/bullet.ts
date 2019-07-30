import Entity from "../../primitives/entity";
import Sprite from "../../primitives/sprite";
import { Vector } from "../../types";

interface BulletOptions {
    src: string;
    imgSize: string;
    speed: number;
    angle: number;
    direction: Vector;
    damage: number;
    bulletDestroyRadius: number;
    bounceCount: number;
    rewardBlitz: boolean
}

/**
 * Basic Bullet class. Most projectiles will be using this class.
 */
export default class Bullet extends Entity {

    speed: number;
    angle: number;
    damage: number;
    direction: Vector;
    bounceCount: number;
    rewardBlitz: boolean;

    grazed: boolean = false; // Flag if we already grazed this bullet

    constructor(options) {
        super(options);

        this.speed = options.speed;
        this.angle = options.angle;
        this.damage = options.damage;
        this.direction = options.direction;
        this.bounceCount = options.bounceCount;
        this.rewardBlitz = options.rewardBlitz;

        this.children = [new Sprite({
            src: options.src,
            size: options.imgSize,
            position: options.imgSize.multiply(-0.5)
        })];
    }
    

    tick(delta) {
        // Move bullet
        this.position.x += this.direction.x * this.speed * delta;
        this.position.y += this.direction.y * this.speed * delta;
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
        if (this.damage <= 0 && this.parent) this.free();

        if (this.isOffscreen()) {
            if (this.bounceCount) {
                this.bounceCount--;
                if (this.position.y > 576 && this.direction.y > 0) {
                    this.position.y = 576 * 2 - this.position.y;
                    this.direction.y = -this.direction.y;
                } else if (this.position.y < 0 && this.direction.y < 0) {
                    this.position.y = -this.position.y;
                    this.direction.y = -this.direction.y;
                }

                if (this.position.x > 1024 && this.direction.x > 0) {
                    this.position.x = 1024 * 2 - this.position.x;
                    this.direction.x = -this.direction.x;
                } else if (this.position.x < 0 && this.direction.x < 0) {
                    this.position.x = -this.position.x;
                    this.direction.x = -this.direction.x;
                }

                this.rotation = Math.atan2(this.direction.y, this.direction.x);
            } else {
                this.damage = 0;
            }
        }
    }
}