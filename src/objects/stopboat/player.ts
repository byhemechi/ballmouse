// Import classes
import Entity from "../../primitives/entity";
import Sprite from "../../primitives/sprite";
import { Vector } from "../../types";
import { getSound, playSound } from "../../sound";
import Bullet from "../stopboat/bullet";
import Weapon from "./weapon";
import Rect from "../../primitives/rect";

// Makes it so you dont need 'Math.' before math functions
const {sin, cos, tan, PI, random, abs, SQRT2, min, max, atan2} = Math;

export default class Player extends Entity {

    constructor(...args) {
        super(...args);
        getSound('hurt', '/assets/stopboat/playerHurt.wav');
    }

    maxHealth = 300;
    health = 300;

    // Size of the hitbox's radius and its square value
    size = 24;
    sizeSquared = this.size ** 2;

    // Position and speed of player
    position = new Vector(64,576/2);
    speed = 420;

    shootJustPressed: boolean = false;
    leftJustPressed: boolean = false;
    rightJustPressed: boolean = false;

    currentWeapon = 0;
    // Array of weapons we currently possess
    weapons = [
        new Weapon({
            speed: 3000,
            damage: 20,
            spread: 0.01,
            fireRate: 0.25,
            magazineSize: 30,
            reloadTime: 2.75,
            shootSound: '/assets/stopboat/shoot1.wav',
            reloadSound: '/assets/stopboat/reload1.wav'
        }),
        new Weapon({
            speed: 3000,
            damage: 4,
            spread: 0.1,
            fireRate: 0.025,
            magazineSize: 60,
            reloadTime: 2.75,
            shootSound: '/assets/stopboat/shoot1.wav',
            reloadSound: '/assets/stopboat/reload1.wav'
        })
    ]

    children = [new Sprite({
        src: "/assets/stopboat/player.svg",
        size: new Vector(60, 64),
        position: new Vector(-30, -32),
        })
    ]

    tick(delta) {

        this.shootJustPressed = this.isShootJustPressed();
        this.leftJustPressed = this.isLeftJustPressed();
        this.rightJustPressed = this.isRightJustPressed();


        this.position.y += this.keyboardMove() * this.speed * delta;

        this.clampPosition();

        this.switchWeapons();

        this.incrementTimers(delta);

        this.checkCollision(delta);

        this.reloadCurrentWeapon(delta);

        if (this.game.keys.KeyZ && !this.weapons[this.currentWeapon].reloadTimer) {
            this.shoot();
        }

        super.tick(delta);
    }

    private reloadCurrentWeapon(delta: any) {
        var weaponNumber = 0;

        this.weapons.forEach(i => {
            // If the weapon is empty, we pressed reload, or it is already reloading, and our magazine is not full
            if ((i.magazine == 0 || this.game.keys.KeyR || i.reloadTimer) && i.magazine != i.magazineSize) {
                if (weaponNumber == this.currentWeapon) { // We can only reload the current weapon
                    if (i.reloadTimer == 0) { // If we just started reloading
                        i.playreload();
                    }

                    i.reloadTimer += delta; // Increment the reload timer

                    if (i.reloadTimer >= i.reloadTime) { // If the timer is up, reload the weapon and set timer to 0
                        i.reloadTimer = 0;
                        i.magazine = i.magazineSize;
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

    switchWeapons() {
        if (this.leftJustPressed) {
            this.currentWeapon -= 1;
        }
        if (this.rightJustPressed) {
            this.currentWeapon += 1;
        }
        this.currentWeapon = (this.weapons.length + this.currentWeapon) % this.weapons.length;
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
        var weaponNumber = 0;

        this.weapons.forEach(i => {
            i.timer += delta
            if (weaponNumber == this.currentWeapon) {
                while (i.timer >= i.fireRate) {
                    i.timer -= i.fireRate;
                    i.canFire = true;
                    i.queue += 1;
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
    checkCollision(delta) {
        this.root.enemyBullets.children.forEach(i => {

            const nextX = i.position.x + i.direction.x * i.speed * delta;
            const nextY = i.position.y + i.direction.y * i.speed * delta;

            if ((nextX - this.position.x) ** 2 + (nextY - this.position.y) ** 2 < this.sizeSquared) {
                this.hurt(i.damage);
                i.free();
            }

            /* // Broken; try to fix later if possible
            const nextX = i.position.x + i.direction.x * i.speed * delta;
            // Only check collision if the bullet will be behind us on this frame
            if (this.position.x + this.size > nextX) {

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
                    this.health -= i.damage;
                    i.free();
                }
            }
            */
        })
    }
    
    /**
     * Logic for when we get hurt
     * @param damage How much damage we took
     */
    hurt(damage: number) {
        this.health -= damage;
        playSound('hurt')
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
        while (this.weapons[this.currentWeapon].queue && this.weapons[this.currentWeapon].magazine) {
            this.weapons[this.currentWeapon].queue --;
            this.weapons[this.currentWeapon].magazine --;
            
            this.weapons[this.currentWeapon].playshoot();

            var angle = this.weaponSpread();

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
        } else {
            didShoot = false;
        }
        this.prevShoot = this.game.keys.KeyZ;
        return didShoot;
    }

    prevLeft = false;

    isLeftJustPressed() {
        var didLeft;
        if (this.game.keys.ArrowLeft && !this.prevLeft) {
            didLeft = true;
        } else {
            didLeft = false;
        }
        this.prevLeft = this.game.keys.ArrowLeft;
        return didLeft;
    }

    prevRight = false;

    isRightJustPressed() {
        var didRight;
        if (this.game.keys.ArrowRight && !this.prevRight) {
            didRight = true;
        } else {
            didRight = false;
        }
        this.prevRight = this.game.keys.ArrowRight;
        return didRight;
    }
}