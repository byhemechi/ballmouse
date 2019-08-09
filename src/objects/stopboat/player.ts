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
        getSound('graze', '/assets/stopboat/graze.wav');
    }

    maxHealth = 99;
    health = 99;

    // How much damage we took, used for deathblitzing
    damage = 0;
    // Variables for deathblitzing
    deathBlitzTimer = 0;
    deathBlitzMaxTime = 0.15;

    invincibleTimer = 0;
    invincibleTime = 3;

    // Size of the hitbox's radius
    size = 24;

    // Size of the graze hitbox's radius, used for scoring
    grazeSize = 64;

    // Position and speed of player
    position = new Vector(64, 576 / 2);
    speed = 420;

    currentWeapon = 0;

    // Array of weapons we currently possess
    weapons = [
        new Weapon({ // 312.5 dps
            speed: 4000,
            damage: 100,
            angularSpread: 0.01,
            fireRate: 0.4,
            ammoType: 0,
            shootSound: '/assets/stopboat/shoot1.wav',
            src: "/assets/stopboat/bullet.png",
            spriteSize: new Vector(102, 5),
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
            spriteSize: new Vector(102, 5)
        }),
        new Weapon({ // 272.72 dps
            speed: 5000,
            damage: 10,
            angularSpread: 0.05,
            linearSpread: 20,
            fireRate: 1.1,
            ammoType: 2,
            spreadIsRandom: false,
            shotCount: 30,
            shootSound: '/assets/stopboat/shoot1.wav',
            src: "/assets/stopboat/bullet.png",
            spriteSize: new Vector(102, 5)
        })

    ];

    // Timer so we can't spam blitz
    blitzCooldownTime = 7;
    blitzCooldownTimer = 0;

    currentBlitzWeapon = 0;

    // Array of blitz weapons we currently possess
    blitzWeapons = [
        new Weapon({ // 1440 total
            speed: 1500,
            damage: 15,
            angularSpread: Math.PI * 4 / 5,
            linearSpread: 0,
            spreadIsRandom: false,
            fireRate: 0.03,
            ammoType: 3,
            chargeMax: 24,
            shotCount: 24,
            chargeTime: 1,
            chargeTimer: 1,
            blitzSound: '/assets/stopboat/shootBlitz2.wav',
            src: "/assets/stopboat/bullet.png",
            spriteSize: new Vector(204, 5),
            bounceCount: 8,
            positionLocked: true,
            rewardBlitz: false
        }),
        new Weapon({ // 2400 total
            speed: 5000,
            damage: 3,
            angularSpread: 0.02,
            linearSpread: 75,
            tilt: 0.1,
            fireRate: 0.005,
            ammoType: 4,
            blitzSound: '/assets/stopboat/shootBlitz2.wav',
            src: "/assets/stopboat/bullet.png",
            spriteSize: new Vector(102, 5),
            rewardBlitz: false
        }),
        new Weapon({ // 5000 total
            speed: 200,
            damage: 10,
            angularSpread: 0,
            linearSpread: 1500,
            fireRate: 0.1,
            ammoType: 5,
            spreadIsRandom: false,
            chargeMax: 500,
            shotCount: 500,
            chargeTime: 1,
            chargeTimer: 1,
            blitzSound: '/assets/stopboat/shootBlitz2.wav',
            src: "/assets/stopboat/bullet.png",
            spriteSize: new Vector(102, 5),
            rewardBlitz: false
        })
    ];

    blitzPosition = new Vector;

    ammo = [Infinity, 200, 50, 0, 0, 0]
    MAXAMMO = [Infinity, 500, 100, 4, 900, 1]

    children = [
        new Sprite({
            src: "/assets/stopboat/boot.png",
            size: new Vector(32, 32),
            position: new Vector(8, 20)
        }),
        new Sprite({
            src: "/assets/stopboat/player.svg",
            size: new Vector(60, 64),
            position: new Vector(-30, -32),
        }),
        new Sprite({
            src: "/assets/stopboat/boot.png",
            size: new Vector(32, 32),
            position: new Vector(-20, 25)
        }),
        new Sprite({
            src: "/assets/stopboat/guns.png",
            size: new Vector(96, 96),
            position: new Vector(0, -30),
            region: {
                begin: new Vector(0, 0),
                size: new Vector(250, 250)
            },
        })

    ];


    tick(delta) {
        // Move player according to user input
        if (this.root.gameStarted) {
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
    }

    /** Clamp player position so they don't go off screen */
    private clampPosition() {
        this.position.y = Math.min(Math.max(this.position.y, 16), this.game.el.height - 36);
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
     * Update timers for weapons and increment bullet queue
     * @param delta 
     */
    private incrementTimers(delta: number) {
        for (let i = 0; i < this.weapons.length; i++) {
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
        for (let i = 0; i < this.root.enemyBullets.children.length; i++) {
            let eb = this.root.enemyBullets.children[i];

            const nextX = eb.position.x + eb.direction.x * eb.speed * delta;

            const nextY = eb.position.y + eb.direction.y * eb.speed * delta;

            if ((nextX - this.position.x) ** 2 + (nextY - this.position.y) ** 2 < this.size ** 2) {
                this.hurt(eb.damage);
                eb.damage = 0;
            }
            if (!eb.grazed && (nextX - this.position.x) ** 2 + (nextY - this.position.y) ** 2 < this.grazeSize ** 2) {
                eb.grazed = true;
                this.game.score += Math.round(1 * this.root.scoreMultiplier);
                playSound('graze');
                this.root.increaseScoreMultiplier(0.005);
            }

        }
    }

    /** Caps ammunition under the limit */
    private capAmmo() {
        for (let i = 0; i < this.ammo.length; i++) {
            this.ammo[i] = Math.min(this.ammo[i], this.MAXAMMO[i]);
        }
    }

    /**
     * Shoot bullets if we are able to 
     */
    private tryShoot() {

        // Check if we are currently blitzing
        let blitzing = false;

        for (let i = 0; i < this.blitzWeapons.length; i++) {
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
                this.ammo[wpn.ammoType]--;

                if (wpn.shotCount > 0) wpn.playshoot();

                this.shoot(wpn, this.position);
            }

            wpn.queue = 0; // If we run out of ammo before we finish our queue, clear the queue
        } else {
            this.weapons[this.currentWeapon].timer = 0;
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
            this.invincibleTimer = this.invincibleTime;
        }

        this.blitzCooldownTimer -= delta;
        if (this.blitzCooldownTimer < 0) this.blitzCooldownTimer = 0;

        if (this.invincibleTimer > 0) {
            this.invincibleTimer -= delta;
            this.children.forEach(i => {
                i.visible = !i.visible
            })


        } else if (this.ammo[this.blitzWeapons[this.currentBlitzWeapon].ammoType] > 0) {

            this.children.forEach(i => {
                i.visible = !i.visible
            })
        }

        if (this.invincibleTimer < 0) {
            this.invincibleTimer = 0;
            this.children.forEach(i => {
                i.visible = true
            })
        }

    }

    /** Check if the player activated a blitz, and if they can blitz */
    private checkBlitz() {
        // If we pressed the blitz key and the cooldown timer expired
        if (this.game.keyJustPressed('KeyX') && !this.blitzCooldownTimer) {
            // If we can afford to blitz
            if (this.root.scoreMultiplier >= 3) {
                if (this.invincibleTimer) this.root.scoreMultiplier -= 1.5;
                else this.root.scoreMultiplier -= 2;
                this.currentBlitzWeapon = this.currentWeapon; // Set the blitz weapon to our current weapon
                this.ammo[this.blitzWeapons[this.currentBlitzWeapon].ammoType] = this.MAXAMMO[this.blitzWeapons[this.currentBlitzWeapon].ammoType]
                this.blitzPosition.x = this.position.x;
                this.blitzPosition.y = this.position.y;
                this.blitzWeapons[this.currentBlitzWeapon].playblitz(); // Play shoot sound

                this.blitzCooldownTimer = this.blitzCooldownTime;

                // Start deathblitz timer
                this.damage = 0;
                this.deathBlitzTimer = 0;
            }
        }
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

        if (this.ammo[bw.ammoType] > 0) {
            bw.timer += delta;
            while (bw.timer > bw.fireRate && this.ammo[bw.ammoType] > 0) {
                bw.timer -= bw.fireRate;
                this.ammo[bw.ammoType]--;

                const pos = bw.positionLocked ? this.blitzPosition : this.position;
                this.shoot(bw, pos.multiply(1));
            }

            
            // Start invincibility time
            if (this.ammo[bw.ammoType] <= 0) {
                this.invincibleTimer = this.invincibleTime;
            }
        }


    }

    /**
     * Determine movement direction
     */
    private keyboardMove() {
        let move = 0;

        move -= this.game.keys.KeyI ? 1 : 0;
        move += this.game.keys.KeyK ? 1 : 0;

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
    }

    /**
     * Shoot method, creates a bullet with given parameters
     * @param wpn The weapon object used to set parameters for the bullet
     * @param position The position where the bullets should spawn at
     */
    private shoot(wpn: Weapon, position: Vector) {
        for (let i = 0.5; i < wpn.shotCount; i++) {
            let angle: number;
            let variance: number;

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
                bounceCount: wpn.bounceCount,
                rewardBlitz: wpn.rewardBlitz
            });
<<<<<<< Updated upstream
            bullet.position.x = this.position.x;
            bullet.position.y = this.position.y;
=======

            bullet.position.x = position.x + 80;
            bullet.position.y = position.y + variance + 11;
>>>>>>> Stashed changes
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
    
    /**
     * Resets the player to default state
     */
    reset() {
        this.health = this.maxHealth;
        this.currentWeapon = 0;
        this.invincibleTimer = 0;
        this.children.forEach(i => {
            i.visible = true
        });
        this.position = new Vector(64, 576 / 2);
        this.ammo = [Infinity, 200, 50, 0, 0, 0]
    }
}