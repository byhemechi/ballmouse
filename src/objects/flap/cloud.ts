import Entity from '../../primitives/entity';
import Sprite from '../../primitives/sprite';
import { Vector } from '../../types';

export default class Cloud extends Entity {

    sizeRatio: number;
    speedRatio: number;
    minSpeed: number = 80;

    position: Vector = new Vector(740, Math.random() * 200)

    children = [
        new Sprite({
            src: "/assets/flap/cloud.png"
        }),
        new Sprite({
            src: "/assets/flap/cloudtransparent.png"
        })
    ]
    
    tick(delta) {
        this.position.x -= this.parent.parent.speed * this.speedRatio * delta + this.minSpeed * this.speedRatio * delta;
        if(this.position.x < -800) this.free();
    }
}