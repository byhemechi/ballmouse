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
        size: new Vector(64, 58),
        position: new Vector(-32, -32),
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

<<<<<<< Updated upstream
=======
    /** Switch player weapons when they press J or L */
    private switchWeapons() {
        if (this.game.keyJustPressed('KeyJ') || this.game.keyJustPressed('ArrowLeft')) {
            this.currentWeapon -= 1;
        }
        if (this.game.keyJustPressed('KeyL') || this.game.keyJustPressed('ArrowRight')) {
            this.currentWeapon += 1;
        }
        this.currentWeapon = (this.weapons.length + this.currentWeapon) % this.weapons.length;
        this.children[3].region.begin.x = 250 * this.currentWeapon
    }

    /**
     * Update timers for weapons and increment bullet queue
     * @param delta 
     */
    private incrementTimers(delta: number) {
        for (let i = 0; i < this.weapons.length; i++) {
            let wpn = this.weapons[i];

            wpn.timer += delta;
>>>>>>> Stashed changes


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

<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
        move -= this.game.keys.KeyI || this.game.keys.ArrowUp ? 1 : 0;
        move += this.game.keys.KeyK || this.game.keys.ArrowDown ? 1 : 0;
>>>>>>> Stashed changes
=======
        move -= this.game.keys.KeyI || this.game.keys.ArrowUp ? 1 : 0;
        move += this.game.keys.KeyK || this.game.keys.ArrowDown ? 1 : 0;
>>>>>>> Stashed changes

        })
    }

    /**
     * Shoot bullets if we are able to 
     */
    private keyboardMove() {
        let move = 0;

        move -= this.game.keys.KeyI || this.game.keys.ArrowUp ? 1 : 0;
        move += this.game.keys.KeyK || this.game.keys.ArrowDown ? 1 : 0;

        return move;
    }

    /**
     * Logic for when we get hurt
     * @param damage How much damage we took
     */
    private hurt(damage: number) {
        if (this.ammo[this.blitzWeapons[this.currentBlitzWeapon].ammoType] <= 0 &&
            this.invincibleTimer <= 0 && this.damage == 0) {
            this.damage = damage;
            playSound('hurt')
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
<<<<<<< Updated upstream
            bullet.position.x = this.position.x;
            bullet.position.y = this.position.y;
=======

            bullet.position.x = position.x + 80;
            bullet.position.y = position.y + variance + 11;
>>>>>>> Stashed changes
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