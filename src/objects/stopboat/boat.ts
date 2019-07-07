import Entity from "../../primitives/entity";
import Sprite from "../../primitives/sprite";
import { Vector } from "../../types";

export default class Boat extends Entity {

    health = 50;

    speed = 100;

    velocity: Vector;

    size = new Vector(64,32);

    children = [
        new Sprite({
            src: "/assets/stopboat/boat.png",
            position: new Vector(-32, -16)
        })
    ]

    tick(delta) {
        this.position.x += delta * this.speed * this.velocity.x;
        this.position.y += delta * this.speed * this.velocity.y;
        this.collide();
        this.bounceOffWall();

        this.invade();

        if (this.dead()) this.kill();
    }

    // Checks collision between boats and bullets using magic
    collide() {
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
            
            this.parent.parent.bullets.children.forEach(i => {
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

                if (!this.dead()) {
                    // If the bullet is right of the line, we collided
                    if (i.position.x > (i.position.y - Yb) / Ym) {
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
            
            this.parent.parent.bullets.children.forEach(i => {
                var Ym = 0.00000001; // Gradient of new line
                var Yx = 0; // Placeholder for finding Yb
                var Yb = 0; // The 'b' value in y = mx + b

                // If we are between the top and middle of the boat
                if (i.position.y > minY && i.position.y < midY) {
                    Ym = Ym1;
                    Yb = Yb1;

                } else if (i.position.y >= midY && i.position.y < maxY) {
                    Ym = Ym2;
                    Yb = Yb2;
                }

                if (!this.dead()) {
                    // If the bullet is right of the line, we collided
                    if (i.position.x > (i.position.y - Yb) / Ym) {
                        this.health -= i.damage;
                        i.free()
                    }
                }
            });
        }
    }

    // Bounces boats when they touch the edge of the screen
    bounceOffWall() {
        if (this.position.y > this.game.el.height && this.velocity.y > 0
         || this.position.y < 0 && this.velocity.y < 0) {
            this.velocity.y = -this.velocity.y;
            this.rotation = Math.PI + (Math.PI - this.rotation)
        }
    }

    invade() {
        if (this.position.x < 20) {
            this.game.score -= 10;
            this.free();
        }
    }

    dead() {
        if (this.health <= 0) {
            return true;
        }
    }

    kill() {
        this.game.score += 1;
        this.free();
    }
}