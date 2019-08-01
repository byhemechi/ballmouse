import Entity from "../../primitives/entity";
import Rect from "../../primitives/rect";
import { Vector } from "../../types";


export default class Enemy extends Entity {
    size = new Vector(100,100)
    children = [
        new Rect({
            fill: '#000',
            size:new Vector(100,100)
        })
    ]
    tick(delta){
        this.position.x -= this.root.speed * delta
    }
}