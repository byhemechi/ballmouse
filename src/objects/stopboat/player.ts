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

    maxHealth = 99;
    health = 99;

    damage = 0; // How much damage we took, used for deathblitzing

    deathBlitzTimer = 0;
    deathBlitzMaxTime = 0.15;

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
            angularSpread: 0.01,
            fireRate: 0.4,
            ammoType: 0,
            shootSound: '/assets/stopboat/shoot1.wav',
            src: "/assets/stopboat/bullet.png",
            spriteSize: new Vector(74,5)
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
            spriteSize: new Vector(74,5)
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
            spriteSize: new Vector(74,5)
        })

    ];

    blitzWeapon = new Weapon({
        speed: 5000,
        damage: 2,
        angularSpread: 0.02,
        linearSpread: 75,
        fireRate: 0.0025,
        ammoType: 3,
        shootSound: '/assets/stopboat/shootBlitz2.wav',
        src: "/assets/stopboat/testBullet.png",
        spriteSize: new Vector(64, 64)

    });

    ammo = [Infinity, 200, 1000, 0]
    MAXAMMO = [Infinity, 500, 5000, 1800]

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

        this.tryShoot();
        
        this.checkBlitz();

        this.doBlitz(delta);

        super.tick(delta);

        this.health = Math.min(this.health, this.maxHealth);

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
        if (this.game.keyJustPressed('ArrowLeft')) {
            this.currentWeapon -= 1;
        }
        if (this.game.keyJustPressed('ArrowRight')) {
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
                    if (this.game.keys.KeyZ && i.timer > i.fireRate) { // If soot is pressed and we can start charging, increase the charge
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
                i.damage = 0;
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
        if (this.ammo[this.blitzWeapon.ammoType] <= 0) { // Invincible during blitz
            this.health -= damage;
            playSound('hurt')
        }
    }


    /**
     * Shoot bullets if we are able to 
     */
    private tryShoot() {
        // If we just pressed shoot and we are ready to shoot, 
        // set the timer to zero and flag that we can't fire  
        let wpn = this.weapons[this.currentWeapon];

        if (!this.game.keys.KeyZ) wpn.queue = 0;

        if (wpn.chargeMax == 0) {
            if (this.game.keyJustPressed('KeyZ') && wpn.canFire) {
                wpn.timer = 0;
                wpn.queue = 1;
            }
        } else {
            if (this.game.keyJustReleased('KeyZ')) {
                wpn.shotCount = Math.round(Math.min(wpn.chargeTimer / wpn.chargeTime, 1) * wpn.chargeMax);
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
            this.ammo[wpn.ammoType] -= Math.ceil(wpn.shotCount);
            
            if (wpn.shotCount > 0) wpn.playshoot();

            this.shoot(wpn, this.position);
            
        }
        wpn.queue = 0; // If we run out of ammo before we finish our queue, clear the queue
    }

    private shoot(wpn: Weapon, position: Vector, tilt=0) {
        for (var i = 0.5; i < wpn.shotCount; i++) {
            var angle: number;
            var variance: number;
            if (wpn.spreadIsRandom) {
                angle = this.weaponSpread() * wpn.angularSpread + tilt;
                variance = this.weaponSpread() * wpn.linearSpread;
            } else {
                if (wpn.chargeMax > 1) { 
                    variance = (wpn.shotCount / wpn.chargeMax) * wpn.linearSpread * i / wpn.shotCount - 
                    (wpn.shotCount / wpn.chargeMax) * wpn.linearSpread / 2;

                    angle = (wpn.shotCount / wpn.chargeMax) * wpn.angularSpread * i / wpn.shotCount - 
                    (wpn.shotCount / wpn.chargeMax) * wpn.angularSpread / 2 + tilt;
                }
                else {
                    variance = wpn.linearSpread * i / wpn.shotCount - wpn.linearSpread / 2;
                    angle = wpn.angularSpread * i / wpn.shotCount - wpn.angularSpread / 2 + tilt;
                }
            }
            const bullet = new Bullet({
                speed: wpn.speed,
                angle: angle,
                src: wpn.src,
                imgSize: wpn.spriteSize,
                rotation: angle,
                damage: wpn.damage
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
        const spreadDirection = random() > 0.5 ? -1 : 1;
        const spreadAmount = random() ** 2;
        const spread = spreadDirection * spreadAmount;
        return spread;
    }

    private checkBlitz() {
        if (this.game.keyJustPressed('KeyX') && !this.ammo[this.blitzWeapon.ammoType]) {
            if (this.root.scoreMultiplier >= 2) {
                //this.health += 15;
                //this.root.scoreMultiplier--;
                this.ammo[this.blitzWeapon.ammoType] = this.MAXAMMO[this.blitzWeapon.ammoType]
                this.blitzWeapon.playshoot();
            }
        }
    }

    private doBlitz(delta: number) {
        if (this.ammo[this.blitzWeapon.ammoType] > 0) {
            this.blitzWeapon.timer += delta;
            while (this.blitzWeapon.timer > this.blitzWeapon.fireRate && this.ammo[this.blitzWeapon.ammoType] > 0) {
                this.blitzWeapon.timer -= this.blitzWeapon.fireRate;
                this.ammo[this.blitzWeapon.ammoType]--;
                this.shoot(this.blitzWeapon, this.position.subtract(new Vector(100, 0)), this.keyboardMove() * 0.1);
            }
        }
    }
}