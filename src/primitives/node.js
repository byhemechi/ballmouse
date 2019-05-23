import {Vector} from '../types.js'

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
        for(let i in options) {
            this[i] = options[i]
        }
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
            ctx.translate(Math.round(i.position.x), Math.round(i.position.y));
            ctx.rotate(i.rotation);
            i.render(ctx);
            ctx.translate(-Math.round(i.position.x), -Math.round(i.position.y));
            ctx.rotate(-i.rotation);
        });
    }

    tick(delta) {
        this.children.forEach(i => {
            i.game = this.game;
            i.parent = this;
            i.tick(delta);
        })
    }
}


export default Node;