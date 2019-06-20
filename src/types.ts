export class Vector {
    /**
     *  A 2D Vector class. Doesn't do much at all, pretty much just a helper.
     * @param {number} x 
     * @param {number} y 
     */

    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(...values) {
        const self = new Vector(this.x, this.y);
        values.forEach(i => {
            self.x += i.x;
            self.y += i.y;
        });
        return self;
    }

    subtract(...values) {
        const self = new Vector(this.x, this.y);
        values.forEach(i => {
            self.x -= i.x;
            self.y -= i.y;
        });
        return self;
    }

    multiply(value) {
        const self = new Vector(this.x, this.y);
        self.x *= value;
        self.y *= value;
        return self;
    }

    divide(value) {
        const self = new Vector(this.x, this.y);
        self.x /= value;
        self.y /= value;
        return self;
    }

    toString() {
        return `Vector2(${this.x},${this.y})`
    }
}