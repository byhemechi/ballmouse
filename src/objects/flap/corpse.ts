// Import classes
import Entity from "../../primitives/entity";
import Sprite from "../../primitives/sprite";
import Rect from "../../primitives/rect";
import { Vector } from "../../types";

export default class Hand extends Entity {
    velocity = new Vector;
    gravity = 1700;
    spin = 0;
    dragX = 0;
    
    children = [
        new Sprite({
            src: "/assets/hoverbored/hand.png",
            position: new Vector(-18 * 0.75, -9 * 0.75),
            size: new Vector(36 * 0.75, 18 * 0.75),
        }),
        new Sprite({
            src: "/assets/hoverbored/hand2.png",
            position: new Vector(-18 * 0.75, -9 * 0.75),
            size: new Vector(27, 13),
        }),
        new Sprite({
            src: "/assets/hoverbored/hoverboard.png",
            position: new Vector(-94 / 4, 32/4),
            size: new Vector(94/2, 32/2)
        })
    ]
    tick(delta) {
        this.velocity.x -= 0.5 * this.dragX * delta;
        this.velocity.y += 0.5 * this.gravity * delta;

        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;
        
        this.velocity.x -= 0.5 * this.dragX * delta;
        this.velocity.y += 0.5 * this.gravity * delta;

        this.rotation += this.spin * delta;

        if (this.position.y > this.game.el.height + 50) {
            this.free();
        }
    }
}