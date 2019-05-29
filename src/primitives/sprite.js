import {Vector} from '../types.js'
import Node from "../primitives/node.js"
/**
 * Sprite node
 * @extends Node
 * @param {Object}  options              Options for the node; See below
 * @param {Vector}  options.position     Position vector, defaults to `(0,0)`
 * @param {number}  options.rotation     (Clockwise) Rotation in radians, defaults to `0`
 * @param {String}  options.src          Path or image to draw; size will be discarded.
 * @param {Vector}  options.size         Size Vector, defaults to whatever size the image source is
 * @param {Object=} options.region       The section of the image to draw
 * @param {Vector=} options.region.begin Top left corner of the clipping region
 * @param {Vector=} options.region.size  Size of the clipping region
 */
class   Sprite extends Node {
    constructor(options) {
        super(options)
        this.size = this.size || new Vector
        this.img = new Image(this.size.x, this.size.y);
        this.img.src = options.src;
    }
    render(ctx) {
        if(!this.region) {
            ctx.drawImage(this.img, 0, 0, this.size.x || this.img.naturalWidth, this.size.y || this.img.naturalHeight);
        } else {
            ctx.drawImage(this.img, this.region.begin.x, this.region.begin.y, this.region.size.y, this.region.size.y, 0, 0, this.size.x || this.region.size.x, this.size.y || this.region.size.y);
        }
    }
}

export default Sprite