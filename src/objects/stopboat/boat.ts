import Entity from "../../primitives/entity";
import Sprite from "../../primitives/sprite";
import { Vector } from "../../types";

export default class Boat extends Entity {

    health = 50;

    speed = 100;

    velocity: Vector;

    size = new Vector(64,40);

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
        this.kill();
    }

    // Checks collision between boats and bullets using magic
    collide() {
        var minX = this.position.x - this.size.x / 2;

        this.parent.parent.bullets.children.forEach(i => {
            // Monster collision detection, I swear its worth it
            if (i.position.x > minX) {
                const sin = -this.velocity.y;
                const cos = -this.velocity.x;

                var minY = 1;
                var midY = 0;
                var maxY = 0;

                var Ym = 0.00000001;
                var Yx = 0;
                var Yb = 0;

                if (this.rotation > Math.PI) {
                    minY = this.position.y - (cos * this.size.y + sin * this.size.x) / 2;
                    midY = this.position.y + (cos * this.size.y - sin * this.size.x) / 2;
                    maxY = this.position.y + (cos * this.size.y + sin * this.size.x) / 2;

                    if (i.position.y > minY && i.position.y < midY) {
                        Ym = -cos / sin;
                        Yx = this.position.x - (cos * this.size.x - sin * this.size.y) / 2;
                        Yb = minY - Ym * Yx;

                    } else if (i.position.y >= midY && i.position.y < maxY) {
                        Ym = sin / cos;
                        Yx = this.position.x + (cos * this.size.x - sin * this.size.y) / 2;
                        Yb = maxY - Ym * Yx;
                    }
                } else {
                    minY = this.position.y - (cos * this.size.y + -sin * this.size.x) / 2;
                    midY = this.position.y + (-cos * this.size.y + -sin * this.size.x) / 2;
                    maxY = this.position.y + (cos * this.size.y + -sin * this.size.x) / 2;

                    if (i.position.y > minY && i.position.y < midY) {
                        Ym = sin / cos;
                        Yx = this.position.x + (cos * this.size.x - -sin * this.size.y) / 2;
                        Yb = minY - Ym * Yx;

                    } else if (i.position.y >= midY && i.position.y < maxY) {
                        Ym = -cos / sin;
                        Yx = this.position.x - (-sin * this.size.x - cos * this.size.y) / 2;
                        Yb = maxY - Ym * Yx;
                    }
                }

                if (i.position.x > (i.position.y - Yb) / Ym) {
                    this.health -= i.damage;
                    i.free()
                }

            }
        })
    }

    // Bounces boats when they touch the edge of the screen
    bounceOffWall() {
        if (this.position.y > this.game.el.height && this.velocity.y > 0
         || this.position.y < 0 && this.velocity.y < 0) {
            this.velocity.y = -this.velocity.y;
            this.rotation = Math.PI + (Math.PI - this.rotation)
        }
    }

    kill() {
        if (this.health <= 0) this.free()
    }
}