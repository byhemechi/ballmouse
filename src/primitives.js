import {Vector} from './types.js'

/**
 * Base node class, everything rendered most likely extends this.
 * Note: If you extend this and have a render function, you *MUST* call `super.render(ctx)`, else children will not render.
 */
class Node {
    position = new Vector;
    rotation = 0;
    children = [];
    name = this.constructor.name

    /**
     * @param {Object} options Options for the node. These vary based on what node is being created, but generally will have position, rotation and children.
     * @param {Vector} options.position Position vector, defaults to `(0,0)`
     * @param {number} options.rotation (Clockwise) Rotation in radians, defaults to `0`
     */
    constructor(options) {
        Object.assign(this, options)
    }

    toString() {
        return `[${this.constructor.name} ${JSON.stringify(this)}]`
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {
        this.children.forEach(i => {
            ctx.translate(i.position.x, i.position.y);
            ctx.rotate(i.rotation);
            console.log(`rendering ${i} at (${i.position.x}, ${i.position.y})`)
            i.render(ctx);
            ctx.translate(-i.position.x, -i.position.y);
            ctx.rotate(-i.rotation);
        });
    }
}
/**
 * Rectangle Node
 * @extends Node
 * @param {Object} options Options for the node; See below
 * @param {Vector} options.position Position vector, defaults to `(0,0)`
 * @param {number} options.rotation (Clockwise) Rotation in radians, defaults to `0`
 * @param {Vector} options.size  How wide the rectangle should be, defaults to `(0,0)` (zero size; invisible))
 * @param {string} options.fill   What the rectangle should be filled with, defaults to `#000` (solid black)
 */
class Rect extends Node {
    width = 0;
    fill = "#000";
    height = 0;
    render(ctx) {
        const lf = ctx.fillStyle;
        ctx.fillStyle = this.fill;
        ctx.fillRect(0, 0, 20, 20);
        ctx.fillStyle = lf;
        super.render(ctx);
    }
}

/**
 * Sprite node
 * @extends Node
 * @param {Object}  options            Options for the node; See below
 * @param {Vector}  options.position   Position vector, defaults to `(0,0)`
 * @param {number}  options.rotation   (Clockwise) Rotation in radians, defaults to `0`
 * @param {Image}   options.image      An image, either a `canvas`, `Image` or `<img>`. Size information will be discarded.
 * @param {Vector}  options.size       Size Vector, defaults to whatever size the image source is
 * @param {Object=} options.rect       The section of the image to draw
 * @param {Vector=} options.rect.begin Top left corner of the clipping region
 * @param {Vector=} options.rect.end   Bottom right corner of the clipping region
 */
class Sprite extends Node {
    render(ctx) {
        if(options.rect) {

        } else {

        }
    }
}

export default Node;
export {Node, Rect, Sprite};