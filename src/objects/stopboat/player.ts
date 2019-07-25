// Import classes
import Entity from "../../primitives/entity";
import Sprite from "../../primitives/sprite";
import { Vector } from "../../types";
import { getSound, playSound } from "../../sound";
import Bullet from "../stopboat/bullet";
import Weapon from "./weapon";
import Rect from "../../primitives/rect";
import { timingSafeEqual } from "crypto";

// Makes it so you dont need 'Math.' before math functions
const {sin, cos, tan, PI, random, abs, SQRT2, min, max, atan2} = Math;

export default class Player extends Entity {

    constructor(...args) {
        super(...args);
        getSound('hurt', '/assets/stopboat/playerHurt.wav');
    }

    maxHealth = 100;
    health = 100;

    // Size of the hitbox's radius and its square value
    size = 24;
    sizeSquared = this.size ** 2;

    // Position and speed of player
    position = new Vector(64,576/2);
    speed = 420;

    currentWeapon = 0;
    // Array of weapons we currently possess
    weapons = [
        new Weapon({ // 312.5 dps
            speed: 4000,
            damage: 125,
            spread: 0.01,
            fireRate: 0.4,
            ammoType: 0,
            shootSound: '/assets/stopboat/shoot1.wav',
        }),
        new Weapon({ // 600 dps
            speed: 4000,
            damage: 12,
            spread: 0.1,
            fireRate: 0.02,
            ammoType: 1,
            shootSound: '/assets/stopboat/shoot1.wav',
        }),
        new Weapon({ // 266.7 dps
            speed: 5000,
            damage: 10,
            spread: 0.075,
            fireRate: 0.1,
            ammoType: 2,
            spreadIsRandom: false,
            chargeMax: 80,
            chargeTime: 2.9,
            shootSound: '/assets/stopboat/shoot1.wav',
        })

    ];

    ammo = [Infinity, 200, Infinity]
    MAXAMMO = [Infinity, 500, Infinity]

    children = [new Sprite({
        src: "/assets/stopboat/player.svg",
        size: new Vector(60, 64),
        position: new Vector(-30, -32),
        })
    ]

    tick(delta) {
        this.position.y += this.keyboardMove() * this.speed * delta;

        this.clampPosition();

        this.switchWeapons();

        this.incrementTimers(delta);

        this.checkCollision(delta);

        this.capAmmo();

        this.shoot();
        

        super.tick(delta);


        // At the end, store the input for input on this frame
        this.prevShoot = this.game.keys.Space;
        this.prevLeft = this.game.keys.ArrowLeft;
        this.prevRight = this.game.keys.ArrowRight;
    }
    
    private capAmmo() {
        for (var i = 0; i < this.ammo.length; i++) {
            this.ammo[i] = Math.min(this.ammo[i], this.MAXAMMO[i]);
        }
    }

    /*
    private reloadCurrentWeapon(delta: any) {
        var weaponNumber = 0;

        this.weapons.forEach(i => {
            // If the weapon is empty, we pressed reload, or it is already reloading, and our magazine is not full, and we have that ammotype left
            if ((i.magazine == 0 || this.game.keys.KeyR || i.reloadTimer)
              && i.magazine != i.magazineSize && this.ammo[i.ammoType]) {
                if (weaponNumber == this.currentWeapon) { // We can only reload the current weapon
                    if (i.reloadTimer == 0) { // If we just started reloading
                        i.playreload();
                    }

                    i.reloadTimer += delta; // Increment the reload timer

                    if (i.reloadTimer >= i.reloadTime) { // If the timer is up, reload the weapon and set timer to 0
                        i.reloadTimer = 0;
                        const reloadAmount = Math.min(i.magazineSize, this.ammo[i.ammoType])
                        i.magazine = reloadAmount;
                        this.ammo[i.ammoType] -= reloadAmount;
                        i.timer = 0;
                        i.canFire = true;
                        i.queue = 0;
                    }
                } else { // Weapons that are not our current weapon cannot be reloaded
                    i.reloadTimer = 0;
                }
            }
            weaponNumber++;
        });
    }
    */

    private switchWeapons() {
        if (this.isLeftJustPressed()) {
            this.currentWeapon -= 1;
        }
        if (this.isRightJustPressed()) {
            this.currentWeapon += 1;
        }
        this.currentWeapon = (this.weapons.length + this.currentWeapon) % this.weapons.length;
    }

    /**
     * Determine movement direction
     */
    private keyboardMove() {
        var move = 0;

        move -= this.game.keys.ArrowUp ? 1 : 0;
        move += this.game.keys.ArrowDown ? 1 : 0;

        return move;
    }

    /**
     * Clamp player position so they don't go off screen
     */
    private clampPosition() {
        const border = 16;
        this.position.y = min(max(this.position.y, 0 + border), this.game.el.height - border);
    }

    /**
     * Update timers for weapons and increment bullet queue
     * @param delta 
     */
    private incrementTimers(delta) {
        var weaponNumber = 0;

        this.weapons.forEach(i => {
            i.timer += delta
            if (weaponNumber == this.currentWeapon) {
                if (i.chargeMax == 0) { // If the weapon is not a charge shot
                    while (i.timer >= i.fireRate) {
                        i.timer -= i.fireRate;
                        i.canFire = true;
                        i.queue += 1;
                    }
                } else { // If this weapon is a charge shot
                    if (this.game.keys.Space && i.timer > i.fireRate) { // If space is pressed and we can start charging, increase the charge
                        i.chargeTimer += delta;
                    }
                }
            } else {
                if (i.timer >= i.fireRate) {
                    i.timer = 0;
                    i.canFire = true;
                    i.queue = 0;
                }
            }
            weaponNumber++;
        });
    }
    /**
     * Checks if we collided with an enemy bullet
     * @param delta 
     */
    private checkCollision(delta) {
        this.root.enemyBullets.children.forEach(i => {

            const nextX = i.position.x + i.direction.x * i.speed * delta;
            
            const nextY = i.position.y + i.direction.y * i.speed * delta;

            if ((nextX - this.position.x) ** 2 + (nextY - this.position.y) ** 2 < this.sizeSquared) {
                this.hurt(i.damage);
                i.free();
            }
            
            /*
            // Find the position the bullet will be next
            const nextX = i.position.x + i.direction.x * i.speed * delta;

            // Only check collision if the bullet will be behind us on this frame
            if (this.position.x > nextX + this.size * i.direction.x) {

                // Magic collision detection using distance of a point from a line

                const playerPreviousPosition = new Vector(this.position.x, this.position.y - this.keyboardMove() * this.speed * delta)

                const x1 = i.position.x - playerPreviousPosition.x;
                const y1 = i.position.y - playerPreviousPosition.y;
                const x2 = nextX - this.position.x;
                const y2 = i.position.y + i.direction.y * i.speed * delta - this.position.y;
                
                const m = (y2 - y1) / (x2 - x1);

                const numerator = (y1 - m * x1) ** 2;
                const denominator = m ** 2 + 1;

                const distanceSquared = numerator / denominator;

                if (distanceSquared < this.sizeSquared) {
                    this.hurt(i.damage);
                    i.free()
                }
            }
            */
            
        })
    }

    /**
     * Logic for when we get hurt
     * @param damage How much damage we took
     */
    private hurt(damage: number) {
        this.health -= damage;
        playSound('hurt')
    }


    /**
     * Shoot bullets if we are able to 
     */
    private shoot() {
        // If we just pressed shoot and we are ready to shoot, 
        // set the timer to zero and flag that we can't fire  
        let wpn = this.weapons[this.currentWeapon];

        if (!this.game.keys.Space) wpn.queue = 0;

        if (wpn.chargeMax == 0) {
            if (this.isShootJustPressed() && wpn.canFire) {
                wpn.timer = 0;
                wpn.queue = 1;
            }
        } else {
            if (this.isShootJustReleased()) {
                wpn.shotCount = Math.min(wpn.chargeTimer / wpn.chargeTime, 1) * wpn.chargeMax;
                wpn.chargeTimer = 0;
                wpn.timer = 0;
                wpn.queue = 1;
            } else {
                wpn.queue = 0;
            }
        }
        // If we can fire, create a bullet
        while (wpn.queue > 0 && this.ammo[wpn.ammoType] > 0) {
            wpn.queue--;
            wpn.canFire = false;
            this.ammo[wpn.ammoType]--
            
            wpn.playshoot();

            for (var i = 0; i < wpn.shotCount; i++) {
                var angle: number;

                if (wpn.spreadIsRandom) angle = this.weaponSpread() * wpn.spread;
                else angle = wpn.spread * i / wpn.shotCount - wpn.spread / 2;

                const bullet = new Bullet({
                    speed: wpn.speed,
                    angle: angle,
                    size: new Vector(16,4),
                    rotation: angle,
                    damage: wpn.damage
                });
                bullet.position.x = this.position.x;
                bullet.position.y = this.position.y;
                bullet.direction = new Vector(Math.cos(angle), Math.sin(angle));
                this.parent.bullets.children.push(bullet)
            }
        }
        wpn.queue = 0; // If we run out of ammo before we finish our queue, clear the queue
    }
    /**
     * Return a random angle for the bullets. Squares its output to make it more center heavy.
     */
    private weaponSpread() {
        const spreadDirection = random() > 0.5 ? -1 : 1;
        const spreadAmount = random() ** 2;
        const spread = spreadDirection * spreadAmount;
        return spread;
    }


    prevShoot = false
    /**
     * Determine if we pressed shoot on this frame
     */
    private isShootJustPressed() {
        var didShoot
        if (this.game.keys.Space && !this.prevShoot) {
            didShoot = true;
        } else {
            didShoot = false;
        }
        return didShoot;
    }

    private isShootJustReleased() {
        var didLetGo;
        if (!this.game.keys.Space && this.prevShoot) {
            didLetGo = true;
        } else {
            didLetGo = false;
        }
        return didLetGo;
    }

    prevLeft = false;

    private isLeftJustPressed() {
        var didLeft;
        if (this.game.keys.ArrowLeft && !this.prevLeft) {
            didLeft = true;
        } else {
            didLeft = false;
        }
        return didLeft;
    }

    prevRight = false;

    private isRightJustPressed() {
        var didRight;
        if (this.game.keys.ArrowRight && !this.prevRight) {
            didRight = true;
        } else {
            didRight = false;
        }
        return didRight;
    }
}