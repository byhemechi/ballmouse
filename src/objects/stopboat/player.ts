// Import classes
import Entity from "../../primitives/entity";
import Sprite from "../../primitives/sprite";
import { Vector } from "../../types";
import Bullet from "../stopboat/bullet";
import Weapon from "./weapon";
import Rect from "../../primitives/rect";

// Makes it so you dont need 'Math.' before math functions
const {sin, cos, tan, PI, random, abs, SQRT2, min, max, atan2} = Math;

export default class Player extends Entity {

    sizeSquared = 8 ** 2;

    // Position and speed of player
    position = new Vector(64,576/2);
    speed = 420;
    shootJustPressed: boolean = false;

    currentWeapon = 0;
    // Array of weapons we currently possess
    weapons = [
        new Weapon({
            speed: 3000,
            damage: 10,
            spread: 0.005,
            firerate: 0.1,
            magsize: 30,
            reloadtime: 3
        })
    ]

    children = [new Sprite({
        src: "/assets/stopboat/player.svg",
        size: new Vector(128, 64),
        position: new Vector(-64, -32),
        })
    ]

    tick(delta) {

        this.shootJustPressed = this.isShootJustPressed();
        var moveY = this.keyboardMove();

        this.position.y += moveY * this.speed * delta;

        this.clampPosition();

        this.incrementTimers(delta);

        this.checkCollision(delta);

        if (this.game.keys.KeyZ) {
            this.shoot();
        }

        super.tick(delta);
    }



    /**
     * Determine movement direction
     */
    keyboardMove() {
        var move = 0;

        move -= this.game.keys.ArrowUp ? 1 : 0;
        move += this.game.keys.ArrowDown ? 1 : 0;

        return move;
    }

    /**
     * Clamp player position so they don't go off screen
     */
    clampPosition() {
        const border = 16;
        this.position.y = min(max(this.position.y, 0 + border), this.game.el.height - border);
    }

    /**
     * Update timers for weapons and increment bullet queue
     * @param delta 
     */
    incrementTimers(delta) {
        this.weapons.forEach(i => {
            i.timer += delta
            while (i.timer >= i.firerate) {
                i.timer -= i.firerate;
                i.queue += 1;
                i.canFire = true;
            }
        });
    }
    /**
     * Checks if we collided with an enemy bullet
     * @param delta 
     */
    checkCollision(delta) {
        this.root.enemyBullets.children.forEach(i => {
            const m = i.direction.y / i.direction.x;

            const numerator = (m * this.position.x - this.position.y + i.position.y - m * i.position.x) ** 2;
            const denominator = m ** 2 + 1;

            const distanceSquared = numerator / denominator;

            const nextX = i.position.x + i.direction.x * i.speed * delta;

            if (distanceSquared < this.sizeSquared && this.position.x > nextX) {
                this.game.score -= i.damage;
                i.free();
            }


        })
    }

    /**
     * Shoot bullets if we are able to 
     */
    shoot() {
        // If we just pressed shoot and we are ready to shoot, 
        // set the timer to zero and flag that we can't fire  
        if (this.shootJustPressed && this.weapons[this.currentWeapon].canFire) {
            this.weapons[this.currentWeapon].canFire = false;
            this.weapons[this.currentWeapon].timer = 0;
            this.weapons[this.currentWeapon].queue = 1;
        }
        // If we can fire, create a bullet
        while (this.weapons[this.currentWeapon].queue) {
            this.weapons[this.currentWeapon].queue -= 1;
            
            var angle = this.weaponSpread()

            const bullet = new Bullet({
                speed: this.weapons[this.currentWeapon].speed,
                angle: angle,
                size: new Vector(16,4),
                rotation: angle,
                damage: this.weapons[this.currentWeapon].damage
            });
            bullet.position.x = this.position.x;
            bullet.position.y = this.position.y;
            bullet.direction = new Vector(Math.cos(angle), Math.sin(angle));
            this.parent.bullets.children.push(bullet)
        }
    }
    /**
     * Return a random angle for the bullets. Squares its output to make it more center heavy.
     */
    weaponSpread() {
        const spreadDirection = random() > 0.5 ? -1 : 1;
        const spreadAmount = random() ** 2;
        const spreadMagnitude = this.weapons[this.currentWeapon].spread;
        const spread = spreadDirection * spreadAmount * spreadMagnitude;
        return spread;
    }

    prevShoot = false
    /**
     * Determine if we pressed shoot on this frame
     */
    isShootJustPressed() {
        var didShoot
        if (this.game.keys.KeyZ && !this.prevShoot) {
            didShoot = true;
        }
        else {
            didShoot = false;
        }
        this.prevShoot = this.game.keys.KeyZ;
        return didShoot;
    }
}