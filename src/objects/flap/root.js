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

        this.children.forEach(i => {
            // Pipe collision
            if (i.constructor == Pipe) {
                // Minkowski Difference collision
                const minX = this.player.position.x - (i.position.x + i.size.x);
                const maxX = this.player.position.x + this.player.size.x - i.position.x;
                const minY = this.player.position.y - (i.position.y + i.size.y);
                const maxY = this.player.position.y + this.player.size.y - i.position.y;
                
                if (minX < 0 && maxX > 0 && minY < 0 && maxY > 0) {
                    console.log('oww');
                }
            }
        })
        
        // Ceiling + Ground collision
        const screenHeight = 480;
        if (this.player.position.y < 0 || this.player.position.y > screenHeight - this.player.size.y) {
            console.log('oww');
        }
    
        // Move Pipes, capping at 800px/s, accelerating at 8px/s-2
        if (this.speed < 800) {
            this.speed += delta * 8;
        }
        else {
            this.speed = 800;
        }
        this.distanceSincePipe += this.speed * delta;

        // Add Pipes
        if (this.distanceSincePipe > 450) {
            const bottomPipe = new Pipe;
            const topPipe = new Pipe;
            
            bottomPipe.position.y = 160 + random() * 310;
            topPipe.position.y = bottomPipe.position.y - 650;
            this.children.push(bottomPipe, topPipe);
            this.distanceSincePipe -= 450;

        }
        super.tick(delta)
    }

}