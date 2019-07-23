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
 * @param {number} options.thickness How thick the border around the rect will be, does not draw if not defined
 * @param {string} options.borderFill What the border should be filled with, defaults to `#0000` (solid black + invisible)
 * @param {string} options.lineJoin How the corners of the border look, default is `miter`
 */
class Rect extends Entity {

    fill: string;
    size: Vector;

    render(ctx) {

        const thickness = this.thickness || 0; // Prevents thickness from being undefined

        // Border render
        const lw = ctx.lineWidth;
        const lf2 = ctx.strokeStyle;
        const lj = ctx.lineJoin;
        ctx.lineWidth = this.thickness;
        ctx.strokeStyle = this.borderFill || "#0000";
        ctx.lineJoin = this.lineJoin || 'miter';
        ctx.strokeRect(thickness / 2, thickness / 2, this.size.x - thickness, this.size.y - thickness);
        ctx.lineWidth = lw;
        ctx.strokeStyle = lf2;
        ctx.lineJoin = lj;

        // Rect render
        const lf = ctx.fillStyle;
        ctx.fillStyle = this.fill || "#000";
        ctx.fillRect(thickness / 2, thickness / 2, this.size.x - thickness, this.size.y - thickness);
        ctx.fillStyle = lf;
        
        

        super.render(ctx);
        
    }
}

export default Rect;