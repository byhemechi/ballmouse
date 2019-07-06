import Entity from "../../primitives/entity";
import Sprite from "../../primitives/sprite";
import { Vector } from "../../types";


export default class Boat extends Entity {

    health = 20;

    speed = 15;

    velocity: Vector;

    size = new Vector(64,36);

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
        this.kill();
    }

    collide() {
        var minX = this.position.x + this.velocity.x * -this.size.x / 2;

        this.parent.parent.bullets.children.forEach(i => {
            if (i.position.x > minX) {
                var minY = 1;
                var maxY = 0;

                if (this.rotation > 0) {
                    minY = this.position.y - this.size.y / 2 - this.velocity.y * this.size.x / 2;
                    maxY = this.position.y + this.size.y / 2 + this.velocity.y * this.size.x / 2;
                } else {
                    minY = this.position.y - this.size.y / 2 + this.velocity.y * this.size.x / 2;
                    maxY = this.position.y + this.size.y / 2 - this.velocity.y * this.size.x / 2;
                }

                if (i.position.y > minY && i.position.y < maxY) {
                    this.health -= i.damage;
                    i.free()
                }

            }
        })
    }

    kill() {
        if (this.health <= 0) this.free()
    }
}