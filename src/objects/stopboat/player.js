// Import classes
import Entity from "../../primitives/entity.js";
import Sprite from "../../primitives/sprite.js";
import { Vector } from "../../types.js";
import Bullet from "../stopboat/bullet";
import Weapon from "../stopboat/weapon";

// Makes it so you dont need 'Math.' before math functions
const {sin, cos, tan, PI, random, abs, SQRT2, min, max, atan2} = Math;

export default class Player extends Entity {

    // Position and speed of player
    position = new Vector(48,324);
    speed = 420;

    currentWeapon = 0;
    // Array of weapons we currently possess
    weapons = [
        new Weapon({
            speed: 1000,
            spread: 0.1,
            firerate: 0.02,
            magsize: 30,
            reloadtime: 3
        })
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

        this.shootJustPressed = this.isShootJustPressed();
        var moveY = this.keyboardMove();

        this.position.y += moveY * this.speed * delta;

        this.clampPosition();

        this.incrementTimers(delta);

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
     * @param {number} delta 
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

            var bullet = new Bullet({
                speed: this.weapons[this.currentWeapon].speed,
                angle: angle,
                size: new Vector(16,4),
                rotation: angle,
            });
            bullet.position = this.position;
            this.parent.children.push(bullet)
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