import Entity from "../../primitives/entity";
import Sprite from "../../primitives/sprite";
import { Vector } from "../../types";
import Weapon from "./weapon";
import Bullet from "./bullet";

export default class Boat extends Entity {

    health = 50;

    speed = 100;

    velocity: Vector;

    weapon = new Weapon({
        speed: 500,
        damage: 1,
        spread: 0.005,
        firerate: .5,
    })

    size = new Vector(64,32);

    children = [
        new Sprite({
            src: "/assets/stopboat/boat.png",
            position: new Vector(-32, -16)
        })
    ]

    tick(delta) {

        // Do collision before and after moving the boat
        this.collide(delta);

        this.position.x += delta * this.speed * this.velocity.x;
        this.position.y += delta * this.speed * this.velocity.y;

        this.collide(delta);

        this.bounceOffWall();

        this.attemptShoot(delta);

        this.invade();

        if (this.isDead()) this.kill();
    }

    /**
     * Checks collision between boats and bullets using magic
     * @param delta 
     */
    collide(delta) {
        // Get sin and cosin of our angle off our velocity vector, and add minus on the end to make maths a bit easier
        const sin = -this.velocity.y;
        const cos = -this.velocity.x;

        // Key Y points of the boat
        var minY: number; // Top point of boat
        var midY: number; // Left most point of boat
        var maxY: number; // Bottom point of boat

        if (this.rotation > Math.PI) {
            // Calculate Y points
            minY = this.position.y - (cos * this.size.y + sin * this.size.x) / 2;
            midY = this.position.y + (cos * this.size.y - sin * this.size.x) / 2;
            maxY = this.position.y + (cos * this.size.y + sin * this.size.x) / 2;

            const Ym1 = -cos / sin; // Gradient is -cot(x), which is -cos(x)/sin(x)
            const Yx1 = this.position.x - (cos * this.size.x - sin * this.size.y) / 2; // Get the x value of the top point 
            const Yb1 = minY - Ym1 * Yx1; // Calculate y when x is zero 

            const Ym2 = sin / cos; // Gradient is tan(x), which is sin(x)/cos(x)
            const Yx2 = this.position.x + (cos * this.size.x - sin * this.size.y) / 2; // Get the x value of the bottom point 
            const Yb2 = maxY - Ym2 * Yx2; // Calculate y when x is zero 
            
            this.root.bullets.children.forEach(i => {
                var Ym = 0.00000001; // Gradient of new line
                var Yb = 0; // The 'b' value in y = mx + b

                // If we are between the top and middle of the boat
                if (i.position.y > minY && i.position.y < midY) {
                    Ym = Ym1;
                    Yb = Yb1;
                } else if (i.position.y >= midY && i.position.y < maxY) {
                    Ym = Ym2;
                    Yb = Yb2;
                }
            
                if (!this.isDead()) {
                    const maxX = this.position.x + i.speed * delta + 20;
                    // If the bullet is right of the line, we collided
                    if (i.position.x > (i.position.y - Yb) / Ym && i.position.x < maxX) {
                        this.health -= i.damage;
                        i.free()
                    }
                }
            });
        } else {
            // Calculate Y points
            minY = this.position.y - (cos * this.size.y + -sin * this.size.x) / 2;
            midY = this.position.y + (-cos * this.size.y + -sin * this.size.x) / 2;
            maxY = this.position.y + (cos * this.size.y + -sin * this.size.x) / 2;

            const Ym1 = sin / cos; // Gradient is tan(x), which is sin(x)/cos(x)
            const Yx1 = this.position.x + (cos * this.size.x - -sin * this.size.y) / 2; // Get the x value of the top point 
            const Yb1 = minY - Ym1 * Yx1; // Calculate y when x is zero 

            const Ym2 = -cos / sin; // Gradient is -cot(x), which is -cos(x)/sin(x)
            const Yx2 = this.position.x - (-sin * this.size.x - cos * this.size.y) / 2; // Get the x value of the bottom point
            const Yb2 = maxY - Ym2 * Yx2; // Calculate y when x is zero 
            
            this.root.bullets.children.forEach(i => {
                var Ym = 0.00000001; // Gradient of new line
                var Yb = 0; // The 'b' value in y = mx + b

                // If we are between the top and middle of the boat
                if (i.position.y > minY && i.position.y < midY) {
                    Ym = Ym1;
                    Yb = Yb1;

                } else if (i.position.y >= midY && i.position.y < maxY) {
                    Ym = Ym2;
                    Yb = Yb2;
                }
            

                if (!this.isDead()) {
                    const maxX = this.position.x + i.speed * delta + 20;
                    // If the bullet is right of the line, we collided
                    if (i.position.x > (i.position.y - Yb) / Ym && i.position.x < maxX) {
                        this.health -= i.damage;
                        i.free()
                    }
                }
            });
        }
    }

    /**
     * Bounces boats when they touch the edge of the screen
     */
    bounceOffWall() {
        if (this.position.y > this.game.el.height && this.velocity.y > 0
         || this.position.y < 0 && this.velocity.y < 0) {
            this.velocity.y = -this.velocity.y;
            this.rotation = Math.PI + (Math.PI - this.rotation)
        }
    }

    /**
     * Check if we can invade, and do so if we can
     */
    invade() {
        if (this.position.x < 100) {
            //this.game.score -= 10;
            this.free();
        }
    }

    /**
     * Check if we can shoot, and do so if we can
     * @param delta 
     */
    attemptShoot(delta) {
        this.weapon.timer += delta;
        while (this.weapon.timer > this.weapon.firerate) {
            this.weapon.timer -= this.weapon.firerate;

            const angle = Math.PI + this.squareRandom() * this.weapon.spread
             + Math.atan2(this.position.y - this.root.player.position.y,
                          this.position.x - this.root.player.position.x);

            this.shoot(this.weapon.speed, this.weapon.damage, angle);
            /*
            // Do not enable this
            this.shoot(this.weapon.speed, this.weapon.damage, angle + Math.PI/6);
            this.shoot(this.weapon.speed, this.weapon.damage, angle + Math.PI/3);
            this.shoot(this.weapon.speed, this.weapon.damage, angle + Math.PI/2);
            this.shoot(this.weapon.speed, this.weapon.damage, angle + 2*Math.PI/3);
            this.shoot(this.weapon.speed, this.weapon.damage, angle + 5*Math.PI/6);
            this.shoot(this.weapon.speed, this.weapon.damage, angle + Math.PI);
            this.shoot(this.weapon.speed, this.weapon.damage, angle + 7*Math.PI/6);
            this.shoot(this.weapon.speed, this.weapon.damage, angle + 4*Math.PI/3);
            this.shoot(this.weapon.speed, this.weapon.damage, angle + 3*Math.PI/2);
            this.shoot(this.weapon.speed, this.weapon.damage, angle + 5*Math.PI/3);
            this.shoot(this.weapon.speed, this.weapon.damage, angle + 11*Math.PI/6);
            */
        }
    }

    /**
     * Creates a bullet with given parameters
     * @param speed The speed the bullet travels at
     * @param damage How much damage the bullet does
     * @param angle The angle the bullet travels at
     */
    shoot(speed, damage, angle) {
        const bullet = new Bullet({
            speed: speed,
            angle: angle,
            size: new Vector(16,4),
            rotation: angle,
            damage: damage
        });

        bullet.position.x = this.position.x;
        bullet.position.y = this.position.y;
        bullet.direction = new Vector(Math.cos(angle), Math.sin(angle));

        this.root.enemyBullets.children.push(bullet)
 
    }

    squareRandom() {
        const spreadDirection = Math.random() > 0.5 ? -1 : 1;
        const spreadAmount = Math.random() ** 2;
        const spread = spreadDirection * spreadAmount;
        return spread;
    }

    /**
     * Returns if we are dead
     */
    isDead() {
        if (this.health <= 0) {
            return true;
        }
    }

    /**
     * Kills the boat
     */
    kill() {
        this.game.score += 1;
        this.free();
    }
}