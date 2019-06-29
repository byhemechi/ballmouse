import Sprite from "../../primitives/sprite";
import { Vector } from "../../types";
import Entity from "../../primitives/entity";

export default class Ground extends Entity {

    position = new Vector(0, 480-64);

    children = [
        new Sprite({
            src: '/assets/flap/ground.png',
            size: new Vector(720, 100)
        }),
        new Sprite({
            src: '/assets/flap/ground.png',
            size: new Vector(720, 100),
            position: new Vector(720, 0)
        })
    ]

    constructor(...args) {
        super(args);
    }

    tick(delta) {
        this.position.x -= this.parent.speed * delta;

        if (this.position.x < -720) this.position.x += 720
    }
}