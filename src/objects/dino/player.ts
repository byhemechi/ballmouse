import Entity from "../../primitives/entity";
import { Vector } from "../../types";
import Sprite from "../../primitives/sprite";

export default class Player extends Entity {
    children = [new Sprite({
        size: new Vector(40, 40),
        src: "/assets/dinoguy/player.png",
        position: new Vector(-20,-20)
    })]

    position = new Vector(100, 420)

    velocity = 0;

    gravity = 1300;

    jumpForce = 600;

    size = new Vector(0,0)

    isGrounded = true;

    tick(delta) {
        this.rotation += delta * this.root.speed / 50
        if (!this.isGrounded){
            this.velocity += this.gravity*delta;
            this.position.y += this.velocity*delta;
        }

        if (this.position.y > 420){
            this.position.y = 420
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
                this.position.x > cactus.position.x &&
                this.position.y < cactus.position.y + cactus.size.y &&
                this.position.y > cactus.position.y) {
                    this.root.gameOver()
                    if (this.game.keyJustPressed("Space")) {
                        this.root.reset()
                    }
                }
        });
    }
}