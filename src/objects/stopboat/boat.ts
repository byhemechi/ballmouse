import Entity from "../../primitives/entity";
import Sprite from "../../primitives/sprite";
import { Vector } from "../../types";
import Weapon from "./weapon";
import Bullet from "./bullet";
import Splash from "./splash";

export default class Boat extends Entity {

    health = 50;

    speed = 100;

    velocity: Vector;

    giveBlitz = true;

    size = new Vector(64,32);

    weapon = new Weapon({
        speed: 500,
        damage: 25,
        spread: 0.005,
        fireRate: 2,
        shootSound: '/assets/stopboat/shoot1.wav',
        spriteSize: new Vector(74,5)
    })

    turretSprite = new Entity({
        children: [new Sprite({
            src: "/assets/stopboat/turret.png",
            size: new Vector(90, 60),
            position: new Vector(-90/2, -60/2)
        })],
        rotation: Math.PI
    })

    children = [
        new Sprite({
            src: "/assets/stopboat/boat.png",
            size: new Vector(64, 32),
            position: new Vector(-32, -16)
        }),
        this.turretSprite
    ]

    tick(delta) {
        this.collide(delta);
        
        this.move(delta);

        this.bounceOffWall();

        this.attemptShoot(delta);

        this.invade();

        if (this.isDead()) this.kill()

    }

    private move(delta: number) {
        this.position.x += delta * this.speed * this.velocity.x;
        this.position.y += delta * this.speed * this.velocity.y;
    }

    /**
     * Checks collision between boats and bullets using magic
     * @param delta 
     */
    private collide(delta) {
        // Get sin and cosin of our angle off our velocity vector, and add minus on the end to make maths a bit easier
        const sin = this.velocity.y;
        const cos = this.velocity.x;

        const lp = new Vector(this.position.x - this.velocity.x * this.speed * delta, this.position.y - this.velocity.y * this.speed * delta)

        for (let i = 0; i < this.root.bullets.children.length; i++) {
            const bullet = this.root.bullets.children[i];

            const bp = bullet.position;
            const lbp = new Vector(bp.x - bullet.direction.x * bullet.speed * delta - (this.position.x - lp.x), 
                bp.y - bullet.direction.y * bullet.speed * delta - (this.position.y - lp.y));

            const m1 = (lbp.y - bp.y) / (lbp.x - bp.x);
            const b1 = bp.y - m1 * bp.x;

            let collided = false;

            [
                [this.position.x - this.size.x * -cos - this.size.y * sin, this.position.y - this.size.y * -cos + this.size.x * sin, this.position.x + this.size.x * -cos - this.size.y * sin, this.position.y - this.size.y * -cos - this.size.x * sin],
                [this.position.x + this.size.x * -cos - this.size.y * sin, this.position.y - this.size.y * -cos - this.size.x * sin, this.position.x + this.size.x * -cos + this.size.y * sin, this.position.y + this.size.y * -cos - this.size.x * sin],
                [this.position.x + this.size.x * -cos + this.size.y * sin, this.position.y + this.size.y * -cos - this.size.x * sin, this.position.x - this.size.x * -cos + this.size.y * sin, this.position.y + this.size.y * -cos + this.size.x * sin],
                [this.position.x - this.size.x * -cos + this.size.y * sin, this.position.y + this.size.y * -cos + this.size.x * sin, this.position.x - this.size.x * -cos - this.size.y * sin, this.position.y - this.size.y * -cos + this.size.x * sin],
            ].forEach((i, j) => {
                if (!collided) {
                    
                    const m2 = (i[1] - i[3]) / (i[0] - i[2]);

                    const b2 = i[1] - m2 * i[0];

                    const collisionX = (b2 - b1) / (m1 - m2);
        
                    const minX = Math.max(Math.min(i[0], i[2]), Math.min(bp.x, lbp.x));
                    const maxX = Math.min(Math.max(i[0], i[2]), Math.max(bp.x, lbp.x));
        

                    if (collisionX > minX && collisionX < maxX) {
                        collided = true;
                        const sub = Math.min(this.health, bullet.damage)
                        this.health -= bullet.damage;
                        bullet.damage -= sub;
        
                        this.giveBlitz = bullet.rewardBlitz;
                    }
                    
                }
            });
            
        }
    }

    /**
     * Bounces boats when they touch the edge of the screen
     */
    private bounceOffWall() {
        if (this.position.y > this.game.el.height && this.velocity.y > 0
         || this.position.y < 0 && this.velocity.y < 0) {
            this.velocity.y = -this.velocity.y;
            this.rotation = Math.PI + (Math.PI - this.rotation)
        }
    }

    /**
     * Check if we can invade, and do so if we can
     */
    private invade() {
        if (this.position.x < 125) {
            //this.game.score -= 10;
            this.root.increaseScoreMultiplier(-0.1);
            this.free();
        }
    }

    /**
     * Check if we can shoot, and do so if we can
     * @param delta 
     */
    private attemptShoot(delta) {
        this.weapon.timer += delta;
        
        while (this.weapon.timer > this.weapon.fireRate && this.position.x > 250) {
            this.weapon.timer -= this.weapon.fireRate;

            const angle = Math.PI + this.squareRandom() * this.weapon.angularSpread
             + Math.atan2(this.position.y - this.root.player.position.y,
                          this.position.x - this.root.player.position.x);

            this.shoot(this.weapon.speed, this.weapon.damage, angle);
            this.turretSprite.rotation = angle - Math.PI - this.rotation;
        }
    }

    /**
     * Creates a bullet with given parameters
     * @param speed The speed the bullet travels at
     * @param damage How much damage the bullet does
     * @param angle The angle the bullet travels at
     */
    private shoot(speed, damage, angle) {

        this.weapon.playshoot();

        const bullet = new Bullet({
            speed: speed,
            angle: angle,
            src: this.weapon.src,
            imgSize: this.weapon.spriteSize,
            rotation: angle,
            damage: damage
        });

        bullet.position.x = this.position.x;
        bullet.position.y = this.position.y;
        bullet.direction = new Vector(Math.cos(angle), Math.sin(angle));

        this.root.enemyBullets.children.push(bullet)
 
    }

    private squareRandom() {
        const spreadDirection = Math.random() > 0.5 ? -1 : 1;
        const spreadAmount = Math.random() ** 2;
        const spread = spreadDirection * spreadAmount;
        return spread;
    }

    /**
     * Returns if we are dead
     */
    private isDead() {
        if (this.health <= 0) return true;
    }

    /**
     * Kills the boat
     */
    private kill() {
        this.game.score += Math.round(10 * this.root.scoreMultiplier);
        this.root.giveLootToPlayer([0, 2, 0]);
        if (this.giveBlitz) this.root.increaseScoreMultiplier(0.03);

        const splash = new Splash({
            src: "/assets/stopboat/splash.gif",
            size: new Vector(90, 75),
        });

        splash.timer = 0.3;
        splash.position.x = this.position.x - splash.size.x / 2;
        splash.position.y = this.position.y - splash.size.y / 2 - 10;

        this.root.children.push(splash);

        this.free();
    }
}