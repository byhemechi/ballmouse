// Import classes
import Entity from "../../primitives/entity";
import Sprite from "../../primitives/sprite";
import {
    Vector
} from "../../types";
import {
    getSound,
    playSound
} from "../../sound";
import Bullet from "../stopboat/bullet";
import Weapon from "./weapon";

// Makes it so you dont need 'Math.' before math functions

export default class Player extends Entity {

    constructor(...args) {
        super(...args);
        getSound('hurt', '/assets/stopboat/playerHurt.wav');
    }

    maxHealth = 99;
    health = 99;

    // How much damage we took, used for deathblitzing
    damage = 0;
    // Variables for deathblitzing
    deathBlitzTimer = 0;
    deathBlitzMaxTime = 0.15;

    // Size of the hitbox's radius and its square value
    size = 24;

    // Position and speed of player
    position = new Vector(64, 576 / 2);
    speed = 420;

    currentWeapon = 0;

    // Array of weapons we currently possess
    weapons = [
        new Weapon({ // 312.5 dps
            speed: 4000,
            damage: 125,
            angularSpread: 0.01,
            fireRate: 0.4,
            ammoType: 0,
            shootSound: '/assets/stopboat/shoot1.wav',
            src: "/assets/stopboat/bullet.png",
            spriteSize: new Vector(74, 5)
        }),
        new Weapon({ // 600 dps
            speed: 4000,
            damage: 12,
            angularSpread: 0.12,
            linearSpread: 5,
            fireRate: 0.02,
            ammoType: 1,
            shootSound: '/assets/stopboat/shoot1.wav',
            src: "/assets/stopboat/bullet.png",
            spriteSize: new Vector(74, 5)
        }),
        new Weapon({ // 250 dps
            speed: 5000,
            damage: 15,
            angularSpread: 0.1,
            linearSpread: 50,
            fireRate: 0.1,
            ammoType: 2,
            spreadIsRandom: false,
            chargeMax: 50,
            chargeTime: 2.9,
            shootSound: '/assets/stopboat/shoot1.wav',
            src: "/assets/stopboat/bullet.png",
            spriteSize: new Vector(74, 5)
        })

    ];

    // Timer so we can't spam blitz
    blitzCooldownTime = 5;
    blitzCooldownTimer = 0;

    currentBlitzWeapon = 0;

    // Array of blitz weapons we currently possess
    blitzWeapons = [
        new Weapon({
            speed: 5000,
            damage: 2,
            angularSpread: 0.02,
            linearSpread: 75,
            fireRate: 0.0025,
            ammoType: 3,
            shootSound: '/assets/stopboat/shootBlitz2.wav',
            src: "/assets/stopboat/testBullet.png",
            spriteSize: new Vector(64, 64)
        }),
        new Weapon({ // 3600 total
            speed: 5000,
            damage: 2,
            angularSpread: 0.02,
            linearSpread: 75,
            tilt: 0.1,
            fireRate: 0.0025,
            ammoType: 4,
            shootSound: '/assets/stopboat/shootBlitz2.wav',
            src: "/assets/stopboat/bullet.png",
            spriteSize: new Vector(74, 5),
            bulletDestroyRadius: 20,
        }),
        new Weapon({ // 4000 total
            speed: 200,
            damage: 10,
            angularSpread: 0.1,
            linearSpread: 1500,
            fireRate: 0.1,
            ammoType: 5,
            spreadIsRandom: false,
            chargeMax: 400,
            shotCount: 400,
            chargeTime: 1,
            chargeTimer: 1,
            shootSound: '/assets/stopboat/shootBlitz2.wav',
            src: "/assets/stopboat/bullet.png",
            spriteSize: new Vector(74, 5),
            bulletDestroyRadius: 20,
        })
    ];

    ammo = [Infinity, 200, 1000, 0, 0, 0]
    MAXAMMO = [Infinity, 500, 5000, 0, 1800, 1]

    children = [new Sprite({
        src: "/assets/stopboat/player.svg",
        size: new Vector(60, 64),
        position: new Vector(-30, -32),
    })];


    tick(delta) {
        // Move player according to user input
        this.position.y += this.keyboardMove() * this.speed * delta;
        this.clampPosition();

        this.switchWeapons();

        this.incrementTimers(delta);

        this.checkCollision(delta);

        this.capAmmo();

        this.tryShoot();

        this.deathBlitzIncrease(delta);

        this.checkBlitz();

        this.doBlitz(delta);

        // this.health = Math.min(this.health, this.maxHealth);
    }

    /** Clamp player position so they don't go off screen */
    private clampPosition() {
        const border = 16;
        this.position.y = Math.min(Math.max(this.position.y, 0 + border), this.game.el.height - border);
    }

    /** Switch player weapons when they press J or L */
    private switchWeapons() {
        if (this.game.keyJustPressed('KeyJ')) {
            this.currentWeapon -= 1;
        }
        if (this.game.keyJustPressed('KeyL')) {
            this.currentWeapon += 1;
        }
        this.currentWeapon = (this.weapons.length + this.currentWeapon) % this.weapons.length;
    }

    /**
     * Update timers for weapons and increment bullet queue
     * @param delta 
     */
    private incrementTimers(delta: number) {
        for (var i = 0; i < this.weapons.length; i++) {
            let wpn = this.weapons[i];

            wpn.timer += delta;

            if (i == this.currentWeapon) {
                // If the weapon is not a charge shot and timer is up
                if (wpn.chargeMax == 0 && wpn.timer > wpn.fireRate) {
                    wpn.timer -= wpn.fireRate;
                    wpn.canFire = true;
                    wpn.queue += 1;
                } else { // If this weapon is a charge shot
                    // If shoot is pressed and we can start charging, increase the charge
                    if (this.game.keys.KeyZ && wpn.timer > wpn.fireRate) {
                        wpn.chargeTimer += delta;
                    }
                }
            } else {
                wpn.timer = 0;
                wpn.canFire = true;
                wpn.queue = 0;
            }
        }
    }

    /**
     *  Checks collision between player and enemy bullet and resolves it
     *  @param delta 
     */
    private checkCollision(delta: number) {
        for (var i = 0; i < this.root.enemyBullets.children.length; i++) {
            let eb = this.root.enemyBullets.children[i];

            const nextX = eb.position.x + eb.direction.x * eb.speed * delta;

            const nextY = eb.position.y + eb.direction.y * eb.speed * delta;

            if ((nextX - this.position.x) ** 2 + (nextY - this.position.y) ** 2 < this.size ** 2) {
                this.hurt(eb.damage);
                eb.damage = 0;
            }
        }
    }

    /** Caps ammunition under the limit */
    private capAmmo() {
        for (var i = 0; i < this.ammo.length; i++) {
            this.ammo[i] = Math.min(this.ammo[i], this.MAXAMMO[i]);
        }
    }

    /**
     * Shoot bullets if we are able to 
     */
    private tryShoot() {

        // Check if we are currently blitzing
        var blitzing = false;

        for (var i = 0; i < this.blitzWeapons.length; i++) {
            if (this.ammo[this.blitzWeapons[i].ammoType] > 0) {
                blitzing = true;
            }
        }

        // If we are not blitzing
        if (!blitzing) {
            // If we just pressed shoot and we are ready to shoot, 
            // set the timer to zero and flag that we can't fire  
            let wpn = this.weapons[this.currentWeapon];

            // If we are not pressing shoot, clear the weapon queue
            if (!this.game.keys.KeyZ) wpn.queue = 0;

            // Do if the weapon is NOT a charge shot
            if (wpn.chargeMax == 0) {
                if (this.game.keyJustPressed('KeyZ') && wpn.canFire) {
                    wpn.timer = 0;
                    wpn.queue = 1;
                }
            } else { // Do if the weapon IS a charge shot
                if (this.game.keyJustReleased('KeyZ')) {
                    // Calculate shot count
                    wpn.shotCount = Math.round(Math.min(wpn.chargeTimer / wpn.chargeTime, 1) * wpn.chargeMax);
                    // Reset timers
                    wpn.chargeTimer = 0;
                    wpn.timer = 0;
                    // Flag as ready to shoot
                    wpn.queue = 1;
                } else {
                    // Flag as not ready to shoot
                    wpn.queue = 0;
                }
            }


            // If we can fire, create a bullet
            while (wpn.queue > 0 && this.ammo[wpn.ammoType] > 0) {
                wpn.queue--;
                wpn.canFire = false;
                this.ammo[wpn.ammoType] -= wpn.shotCount;

                if (wpn.shotCount > 0) wpn.playshoot();

                this.shoot(wpn, this.position);
            }

            wpn.queue = 0; // If we run out of ammo before we finish our queue, clear the queue
        }
    }

    /** 
     * Increase Deathblitz timer and if the timer runs out, damage the player
     */
    private deathBlitzIncrease(delta: number) {
        if (this.damage) {
            this.deathBlitzTimer += delta;
        }

        if (this.deathBlitzTimer > this.deathBlitzMaxTime) {
            this.health -= this.damage;
            this.damage = 0;
            this.deathBlitzTimer = 0;
        }

        this.blitzCooldownTimer -= delta;
        if (this.blitzCooldownTimer < 0) this.blitzCooldownTimer = 0;
    }

    /** Check if the player activated a blitz, and if they can blitz */
    private checkBlitz() {
        // If we pressed the blitz key and the cooldown timer expired
        if (this.game.keyJustPressed('KeyX') && !this.blitzCooldownTimer) {
            // If we can afford to blitz
            if (this.root.scoreMultiplier >= 2) {
                this.root.scoreMultiplier--;
                this.currentBlitzWeapon = this.currentWeapon; // Set the blitz weapon to our current weapon
                this.ammo[this.blitzWeapons[this.currentBlitzWeapon].ammoType] = this.MAXAMMO[this.blitzWeapons[this.currentBlitzWeapon].ammoType]
                this.blitzWeapons[this.currentBlitzWeapon].playshoot(); // Play shoot sound

                this.blitzCooldownTimer = this.blitzCooldownTime;

                // Start deathblitz timer
                this.damage = 0;
                this.deathBlitzTimer = 0;
            }
        }
    }

    /** 
     * Activate blitz
     * @param delta 
     */
    private doBlitz(delta: number) {
        let bw = this.blitzWeapons[this.currentBlitzWeapon];

        if (this.ammo[bw.ammoType] > 0) {
            bw.timer += delta;
            while (bw.timer > bw.fireRate && this.ammo[bw.ammoType] > 0) {
                bw.timer -= bw.fireRate;
                this.ammo[bw.ammoType]--;
                this.shoot(bw, this.position.subtract(new Vector(100, 0)));
            }
        }
    }

    /**
     * Determine movement direction
     */
    private keyboardMove() {
        var move = 0;

        move -= this.game.keys.KeyI ? 1 : 0;
        move += this.game.keys.KeyK ? 1 : 0;

        return move;
    }

    /**
     * Logic for when we get hurt
     * @param damage How much damage we took
     */
    private hurt(damage: number) {
        if (this.ammo[this.blitzWeapons[this.currentBlitzWeapon].ammoType] <= 0) { // Invincible during blitz
            this.damage += damage;
            playSound('hurt')
        }
    }

    /**
     * Shoot method, creates a bullet with given parameters
     * @param wpn The weapon object used to set parameters for the bullet
     * @param position The position where the bullets should spawn at
     */
    private shoot(wpn: Weapon, position: Vector) {
        for (var i = 0.5; i < wpn.shotCount; i++) {
            var angle: number;
            var variance: number;

            if (wpn.spreadIsRandom) {
                angle = this.weaponSpread() * wpn.angularSpread + wpn.tilt * this.keyboardMove();
                variance = this.weaponSpread() * wpn.linearSpread;
            } else {
                if (wpn.chargeMax > 1) {
                    variance = (wpn.shotCount / wpn.chargeMax) * wpn.linearSpread * i / wpn.shotCount -
                        (wpn.shotCount / wpn.chargeMax) * wpn.linearSpread / 2;

                    angle = (wpn.shotCount / wpn.chargeMax) * wpn.angularSpread * i / wpn.shotCount -
                        (wpn.shotCount / wpn.chargeMax) * wpn.angularSpread / 2 + wpn.tilt * this.keyboardMove();
                } else {
                    variance = wpn.linearSpread * i / wpn.shotCount - wpn.linearSpread / 2;

                    angle = wpn.angularSpread * i / wpn.shotCount - wpn.angularSpread / 2 + wpn.tilt * this.keyboardMove();
                }
            }
            const bullet = new Bullet({
                speed: wpn.speed,
                angle: angle,
                src: wpn.src,
                imgSize: wpn.spriteSize,
                rotation: angle,
                damage: wpn.damage,
                bulletDestroyRadius: wpn.bulletDestroyRadius
            });
            bullet.position.x = position.x;
            bullet.position.y = position.y + variance;
            bullet.direction = new Vector(Math.cos(angle), Math.sin(angle));
            this.root.bullets.children.push(bullet);
        }
    }

    /**
     * Return a random angle for the bullets. Squares its output to make it more center heavy.
     */
    private weaponSpread() {
        const spreadDirection = Math.random() > 0.5 ? -1 : 1;
        const spreadAmount = Math.random() ** 2;
        const spread = spreadDirection * spreadAmount;
        return spread;
    }
}