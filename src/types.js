export class Vector {
    /**
     *  A 2D Vector class. Doesn't do much at all, pretty much just a helper.
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `Vector2(${this.x},${this.y})`
    }
}