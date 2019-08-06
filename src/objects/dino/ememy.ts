import Entity from "../../primitives/entity";
import Rect from "../../primitives/rect";
import { Vector } from "../../types";
import Sprite from "../../primitives/sprite";


export default class Enemy extends Entity {
    size = new Vector(60,100)
    children = [new Sprite({
        size: new Vector(60, 100),
        src: "/assets/dinoguy/cactus.png",
        position: new Vector(0,-10)
    })]
    ]
    tick(delta){
        this.position.x -= this.root.speed * delta
        if (this.position.x < -this.size.x) this.free()
    }
}