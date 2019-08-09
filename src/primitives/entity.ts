import {Vector} from '../types'
import Game from '../games/base';

/**
 * Base Entity class, everything rendered most likely extends this.
 * Note: If you extend this and have a render function, you *MUST* call `super.render(ctx)`, else children will not render.
 */
class Entity {
    [x: string]: any;
    position: Vector = new Vector;
    rotation: number = 0;
    children: Array<Entity> = [];
    visible: boolean = true;
    name: string = this.constructor.name;
    game: any;
    parent: any;
    uid: string
    root: any

    /**
     * @param {Object} options Options for the Entity. These vary based on what Entity is being created, but generally will have position, rotation and children.
     * @param {Vector} options.position Position vector, defaults to `(0,0)`
     * @param {number} options.rotation (Clockwise) Rotation in radians, defaults to `0`
     * @param {bool}   options.visible Should the Entity (and its children) render
     */
    constructor(options: Object = {}) {
        for(let i in options) {
            this[i] = options[i]
        }
        this.uid = btoa(crypto.getRandomValues(new Uint8Array(4)).join(""));
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
            if(i.visible) {
                ctx.translate(Math.round(i.position.x), Math.round(i.position.y));
                ctx.rotate(i.rotation);
                i.render(ctx);
                ctx.rotate(-i.rotation);
                ctx.translate(-Math.round(i.position.x), -Math.round(i.position.y));
            }
        });
    }

    free() {
        this.parent.children.splice(this.parent.children.indexOf(this), 1);
    }

    tick(delta) {
        this.children.forEach(i => {
            i.game = this.game;
            i.parent = this;
            i.root = this.game.root;
            i.tick(delta);
        })
    }
}


export default Entity;