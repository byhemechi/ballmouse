import {Vector} from '../types.js'
import Entity from './entity.js'

class Label extends Entity {
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