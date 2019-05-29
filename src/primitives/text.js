import {Vector} from '../types.js'
import Node from './node.js'

class Label extends Node {
    render(ctx) {
        //  console.log(this.currentTransform   )
        ctx.font = this.font || ctx.font;
        ctx.textBaseline = this.baseline || "top";
        ctx.textAlign = this.align || "left";
        ctx.fillText(this.value, 0, 0);
        super.render()
    }
}

export default Label