import Node from "../../primitives/node.js";
import Pipe from "./pipe.js";
import Player from "./player.js";
import { Vector } from "../../types.js";

const {sin, cos, tan, PI, random} = Math;

export default class Root extends Node {
    player = new Player;
    children = [this.player];
    timeSincePipe = 0;

    speed = 128;
    distanceSincePipe = 0;

    tick(delta) {
        // Do Collision
        for (var i in this.children) {
            if (i.constructor == 'Pipe') {
                console.log('tetett');
            }
        }

        // Move Pipes
        this.speed += delta * 30;
        this.distanceSincePipe += this.speed * delta;
        if (this.distanceSincePipe > 450) {
            const bottomPipe = new Pipe;
            const topPipe = new Pipe;
            
            bottomPipe.position.y = 120 + random() * 240;
            topPipe.position.y = bottomPipe.position.y - 650;
            this.children.push(bottomPipe, topPipe);
            this.distanceSincePipe -= 450;

        }
        super.tick(delta)
    }

}