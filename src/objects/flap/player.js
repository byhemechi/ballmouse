import Node from "../../primitives/node.js";
import Rect from "../../primitives/rect.js";
import { Vector } from "../../types.js";

const gravity = 1700;

export default class Player extends Node {
    v = new Vector(0, 0);

    prevUp = false;
    upJustPressed = false;

    children = [new Rect({
        size: new Vector(20, 20)
    })]

    dir = {l: 0, r: 0}

    t = 0;

    size = new Vector(20,20);

    state = 2;    // 0: Flappy Bird, 1: Copter, 2: Line

    constructor(...args) {
        super(...args);
        this.position.x = 200;
    }

    tick(delta) {
        this.t += delta;

        // Input
        if (this.game.keys.Space && !this.prevUp) {
            this.upJustPressed = true;
        }
        else {
            this.upJustPressed = false;
        }
        this.prevUp = this.game.keys.Space;

        // Gravity if not line
        if (this.state != 2) {
            this.v.y += gravity * delta;
        }
    
        // Flappy Bird
        if (this.state == 0){
            if (this.upJustPressed) {
                this.v.y = -600;
            }
        }
        // Copter
        else if (this.state == 1) {
            if (this.game.keys.Space) {
                this.v.y -= gravity * delta * 2;
                if (this.v.y > 0) {
                    this.v.y -= gravity * delta / 2;
                }
            }
            else {
                if (this.v.y < 0) {
                    this.v.y += gravity * delta / 2
                }
            }



        }
        // Line
        else if (this.state == 2) {
            if (this.game.keys.Space) {
                this.v.y = -this.parent.speed;
            }
            else {
                this.v.y = this.parent.speed;
            }
        }

        // Clamp y velocity based off game mode
        if (this.state == 0) {
            this.v.y = Math.min(Math.max(this.v.y, -800), 800);
        }
        else if (this.state == 1) {
            this.v.y = Math.min(Math.max(this.v.y, -800), 800);
        }

        this.position = this.position.add(this.v.multiply(delta))
        super.tick(delta);
    }
}