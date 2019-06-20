import {Vector} from '../types'
import Entity from './entity'

class Label extends Entity {

    font: string;
    baseline: string;
    align: string;
    value: string;


    render(ctx) {
        ctx.font = this.font || ctx.font;
        ctx.textBaseline = this.baseline || "top";
        ctx.textAlign = this.align || "left";
        ctx.fillText(this.value, 0, 0);
        super.render(ctx)
    }
}

export default Label