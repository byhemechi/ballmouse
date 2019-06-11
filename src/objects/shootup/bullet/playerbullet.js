import Entity from '../../../primitives/Entity';
import Rect from '../../../primitives/rect';
import { Vector } from '../../../types';

const {sin, cos, tan, PI, random, abs, SQRT2, min, max, atan2} = Math;

export default class PlayerBullet extends Entity {
    speed = 600;
    direction = PI;
    children = [new Rect({
        size: new Vector(10, 10),
        position: new Vector(0, 0),
        fill: '#fff'
    })]

    tick(delta) {
        this.position = this.position.add(
            new Vector(cos(this.direction), sin(this.direction))
        ).multiply(this.speed * delta);

        super.tick(delta);
    }

}