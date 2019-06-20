import {Vector} from '../types'
import Entity from './entity'
/**
 * Rectangle Entity
 * @extends Entity
 * @param {Object} options Options for the Entity; See below
 * @param {Vector} options.position Position vector, defaults to `(0,0)`
 * @param {number} options.rotation (Clockwise) Rotation in radians, defaults to `0`
 * @param {Vector} options.size  How wide the rectangle should be, defaults to `(0,0)` (zero size; invisible))
 * @param {string} options.fill   What the rectangle should be filled with, defaults to `#000` (solid black)
 */
class Rect extends Entity {
    render(ctx) {
        const lf = ctx.fillStyle;
        ctx.fillStyle = this.fill || "#000";
        ctx.fillRect(0, 0, this.size.x, this.size.y);
        ctx.fillStyle = lf;
        super.render(ctx);
        
    }
}

export default Rect;