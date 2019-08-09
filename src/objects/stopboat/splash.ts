import Sprite from "../../primitives/sprite";

export default class Splash extends Sprite{
    timer = 0;

    tick(delta) {
        this.timer -= delta;
        if (this.timer < 0) {
            this.free()
        }
    }
}