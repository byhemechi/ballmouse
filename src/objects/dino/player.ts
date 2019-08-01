import Entity from "../../primitives/entity";
import Rect from "../../primitives/rect";
import { Vector } from "../../types";

export default class Player extends Entity {
    children = [new Rect({
        size: new Vector(40, 40)
    })]

    position = new Vector(100, 400)

    velocity = 0;

    gravity = 900;

    jumpForce = 500;

    size = new Vector(40,40)

    isGrounded = true;

    tick(delta) {
        if (!this.isGrounded){
            this.velocity += this.gravity*delta;
            this.position.y += this.velocity*delta;
        }

        if (this.position.y > 400){
            this.position.y = 400
            this.isGrounded = true
        }

        if (this.game.keyJustPressed("Space") && this.isGrounded){
            this.velocity = -this.jumpForce
            this.isGrounded = false
        }
        this.cactusCollide()
    }
    cactusCollide() {
        this.root.cactusContainer.children.forEach(cactus => {
            if (this.position.x < cactus.position.x + cactus.size.x &&
                this.position.x + this.size.x > cactus.position.x &&
                this.position.y < cactus.position.y + cactus.size.y &&
                this.position.y + this.size.y > cactus.position.y) {
                    console.log("died")
                }
        });
    }
}