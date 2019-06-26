import Entity from '../../primitives/entity';
import Sprite from '../../primitives/sprite';
import { Vector } from '../../types';

export default class Cloud extends Sprite {

    speedRatio: number = Math.random() + 0.2;

    position: Vector = new Vector(740, Math.random() * 200)

    sizeRatio: number = Math.random() * 2

    constructor(...args) {
        super({
            src: "/assets/flap/cloud.png",
        });
        this.size = new Vector(128 * this.sizeRatio, 64 * this.sizeRatio)
    }
    
    tick(delta) {
        this.position.x -= this.parent.parent.speed * delta * this.speedRatio;
        if(this.position.x < -128 * this.sizeRatio) this.free();
    }
}