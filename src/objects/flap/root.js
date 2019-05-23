// Import classes
import Node from "../../primitives/node.js";
import Pipe from "./pipe.js";
import Player from "./player.js";
import Rect from "../../primitives/rect.js";
import { Vector } from "../../types.js";

// Make it so you dont need 'Math.' before math functions
const {sin, cos, tan, PI, random} = Math;

export default class Root extends Node {

    player = new Player;
    state = 0;   // Gamemode state

    speed = 128; // Speed of pipes
    maxSpeed = 666;

    distanceBetweenPipes = 450;   // Distance between pipes in state 0
    distanceBetweenPipes2 = 32;   // Distance between pipes in state 1
    distanceBetweenPortal = 4500; // Distance between each mode switch

    distanceSincePipe = 0;        // Distance since last pipe
    distanceSincePortal = -540    // Distance since last portal (this changes player state)
    distanceSincePoint = -540;    // Distance since last point giver
    distanceSinceStateChange = 0; // Distance since last state change (this changes pipe spawning pattern) 

    constructor(...args) {
        super(...args);
        this.children = [new Rect({
            position: new Vector(0, 440),
            size: new Vector(720, 40),
            fill: 'tan'
        }), this.player]
    }

    

    // Smooth random number generator 
    slidingRandom = [0.5,0.5,0.5,0.5];

    newSlidingAverage() {
        this.slidingRandom.push(random()); // Add a new random number to slidingRandom
        this.slidingRandom.shift();        // Remove the first value of slidingRandom
        var total = 0.0;
        for (var i = 0; i < this.slidingRandom.length; ++i) {
            total += this.slidingRandom[i];
        }
        return total / this.slidingRandom.length // Return average of slidingRandom
    }

    createPipe(width, min, range, size=64) {
        var bottomPipe;
        var topPipe;
        var bottomTop = true; // Flag for if we should create bottom or top pipe
        var recycled = false; // Flag if we recycled pipes
        var bottomPipePosition = 0; // Position of bottom pipe

        // Attempt to recycle
        this.children.forEach(i => {
            if (i.free) {
                recycled = true;
                // Generate bottom or top pipe
                if (bottomTop) {
                    i.position = new Vector(720, min + this.newSlidingAverage() * range);
                    i.size = new Vector(size, 500);
                    i.children[0].size = new Vector(size, 500);
                    i.free = false;
                    bottomPipePosition = i.position.y;
                    bottomTop = false;
                }
                else {
                    i.position = new Vector(720, bottomPipePosition - width);
                    i.size = new Vector(size, 500);
                    i.children[0].size = new Vector(size, 500);
                    i.free = false;

                }
            }
        });
        // Create new pipes if no free pipes are available
        if (!recycled){
            bottomPipe = new Pipe;
            topPipe = new Pipe;

            bottomPipe.size = new Vector(size, 500);
            bottomPipe.children[0].size = new Vector(size, 500);
            topPipe.size = new Vector(size, 500);
            topPipe.children[0].size = new Vector(size, 500);
        
            bottomPipe.position.y = min + this.newSlidingAverage() * range;
            topPipe.position.y = bottomPipe.position.y - width;
            this.children.unshift(bottomPipe, topPipe);
        }
    }

    // Called every frame
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
                    this.player.alive = false;
                    this.speed = 0;
                
                
               }
            }
        });
        
        // Ceiling + Ground collision
        const screenHeight = 480;
        if (this.player.position.y < 0 || this.player.position.y > screenHeight - ) {
            this.player.alive = false;
            this.speed = 0;
        }
    
        // Increase speed
        if (this.speed < this.maxSpeed && this.player.alive) {
            this.speed += delta * 6;
        }
        if (this.speed >= this.maxSpeed && this.player.alive) {
            this.speed = this.maxSpeed;
        }

        // Increment counters
        this.distanceSincePipe += this.speed * delta;
        this.distanceSincePoint += this.speed * delta;
        this.distanceSincePortal += this.speed * delta;
        this.distanceSinceStateChange += this.speed * delta;

        // Change State
        if (this.distanceSinceStateChange > this.distanceBetweenPortal) {
            this.state = (this.state + 1) % 2;
            this.distanceSinceStateChange -= this.distanceBetweenPortal;
            this.distanceSincePipe = 0;
        }

        // Change player state
        if (this.distanceSincePortal > this.distanceBetweenPortal) {
            this.player.state = (this.player.state + 1) % 2;
            this.player.v.y = 0;
            this.distanceSincePortal -= this.distanceBetweenPortal;
        }
        
        // Add Pipes
        if (this.state == 0) {
            if (this.distanceSincePipe > this.distanceBetweenPipes) {
                var gap = 650;
                var min = 160;
                var range = 310;

                var difficultyUp = this.speed / this.maxSpeed;
                gap -= difficultyUp * 30;
                min += difficultyUp * 30;
                this.createPipe(gap, min, range);
                this.distanceSincePipe -= this.distanceBetweenPipes;
            };     
        }
        else if (this.state == 1) {
            if (this.distanceSincePipe > this.distanceBetweenPipes2) {

                this.createPipe(700, 225, 230, 24);
                this.distanceSincePipe -= this.distanceBetweenPipes2;
            }
        }

        // Score counter
        if (this.distanceSincePoint > this.distanceBetweenPipes) {
            this.game.score++;
            this.distanceSincePoint -= this.distanceBetweenPipes;
        }
        // Engine stuff, you must have this in tick() function
        super.tick(delta);
    }
}
