import {Vector} from '../types'
import Entity from './entity'

class Label extends Entity {
    render(ctx) {
        ctx.font = this.font || ctx.font;
        ctx.textBaseline = this.baseline || "top";
        ctx.textAlign = this.align || "left";
        ctx.fillText(this.value, 0, 0);
        super.render()
    }
}

export default Label