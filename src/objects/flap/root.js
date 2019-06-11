// Import classes
import Entity from "../../primitives/entity.js";
import Pipe from "./pipe.js";
import Player from "./player.js";
import Rect from "../../primitives/rect.js";
import { Vector } from "../../types.js";
import Label from "../../primitives/text.js";

// Makes it so you dont need 'Math.' before math functions
const {sin, cos, tan, PI, random} = Math;

export default class Root extends Entity {

    player = new Player;
    state = 0;   // Gamemode state

    speed = 200; // Speed of pipes
    maxSpeed = 600;

    started = false;

    distanceBetweenPipes = 450;   // Distance between pipes in state 0
    distanceBetweenPipes2 = 45;   // Distance between pipes in state 1
    distanceBetweenPortal = 450*5;  // Distance between each mode switch

    distanceSincePipe = 0;        // Distance since last pipe
    distanceSincePortal = -540    // Distance since last portal (this changes player state)
    distanceSincePoint = -540;    // Distance since last point
    distanceSinceStateChange = 0; // Distance since last state change (this changes pipe spawning pattern) 


    constructor(...args) {
        super(...args);
        this.children = [new Rect({
            position: new Vector(0, 440),
            size: new Vector(720, 40),
            fill: 'tan'
        }), this.player, new Label({
            value: "Flappy Guy",
            font: "32px sans-serif",
            position: new Vector(360, 240),
            baseline: "middle",
            align: "center"
        })]
    }

    prevJump = false; // Space state on last frame
    jumpJustPressed = false;

    // Smooth random number generator 
    slidingRandom = [0.5,0.5,0.5,0.5];

    /**
     * Create a random value smoothed by previous outputs
     */
    newSlidingRandom() {
        this.slidingRandom.push(random()); // Add a new random number to slidingRandom
        this.slidingRandom.shift();        // Remove the first value of slidingRandom
        var total = 0.0;
        for (var i = 0; i < this.slidingRandom.length; ++i) {
            total += this.slidingRandom[i];
        }
        return total / this.slidingRandom.length // Return average of slidingRandom
    }
    /**
     * Creates a new pipe
     * @param {Number} width The size of the gap between pipes
     * @param {Number} min The minimum distance of bottom pipe from the top of the screen
     * @param {Number} range The range where the pipes can move
     * @param {Number} size Size of the hitbox for the pipe
     * @param {String} sprite Path to the sprite used for the pipe
     * @param {bool} useSlidingRandom Should the position be smoothed
     */
    createPipe(width, min, range, size, sprite, useSlidingRandom) {
        var bottomPipe;
        var topPipe;
        var bottomTop = true; // Flag for if we should create bottom or top pipe
        var recycled = false; // Flag if we recycled pipes
        var bottomPipePosition = 0; // Position of bottom pipe

        // Attempt to recycle
        this.children.forEach(i => {
            if (i.free) {
                recycled = true;
                // Generate bottom and top pipe
                if (bottomTop) {
                    if (useSlidingRandom) i.position = new Vector(720, min + this.newSlidingRandom() * range);
                    else i.position = new Vector(720, min + random() * range);
                    i.size = new Vector(size, 500);
                    //i.children[0].size = new Vector(size, 500);
                    i.children[0].img.src = sprite;
                    i.free = false;
                    i.visible = true;
                    bottomPipePosition = i.position.y;
                    bottomTop = false;
                }
                else {
                    i.position = new Vector(720, bottomPipePosition - width);
                    i.size = new Vector(size, 500);
                    i.children[0].img.src = sprite;
                    i.free = false;
                    i.visible = true;

                }
            }
        });
        // Create new pipes if no free pipes are available
        if (!recycled){
            bottomPipe = new Pipe;
            topPipe = new Pipe;

            bottomPipe.size = new Vector(size, 500);
            bottomPipe.children[0].img.src = sprite;

            topPipe.size = new Vector(size, 500);
            topPipe.children[0].img.src = sprite;
            
            if (useSlidingRandom) bottomPipe.position.y = min + this.newSlidingRandom() * range;
            else bottomPipe.position.y = min + random() * range;
            topPipe.position.y = bottomPipe.position.y - width;
            this.children.unshift(bottomPipe, topPipe);
        }
    }

    // Called every frame
    tick(delta) {
        // Input if jump pressed this frame
        if (this.game.keys.Space && !this.prevJump) {
            this.jumpJustPressed = true;
        }
        else {
            this.jumpJustPressed = false;
        }
        this.prevJump = this.game.keys.Space;

        if (this.jumpJustPressed && !this.started) {
            this.children[(this.children).length-1].visible = false;
            this.player.restart()
            this.started = true;
            this.speed = 200;
            this.game.score = 0;

            this.distanceSincePipe = 0;
            this.distanceSincePortal = -540;
            this.distanceSincePoint = -540;
            this.distanceSinceStateChange = 0;
            this.state = 0;
            this.player.state = 0;


            // Disable all pipes
            this.children.forEach(i => {
                if (i.constructor == Pipe) {
                    i.free = true;
                    i.visible = false;
                    i.position.x = -50;
                }
            })
        }

        if (this.started) {
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
            if (this.player.position.y < 0 || this.player.position.y > screenHeight - 60) {
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
                //this.player.v.y = 0;
                this.distanceSincePortal -= this.distanceBetweenPortal;
            }
            
            // Add Pipes
            if (this.state == 0) {
                if (this.distanceSincePipe > this.distanceBetweenPipes) {
                    var gap = 650;
                    var min = 140;
                    var range = 250;

                    var difficultyUp = this.speed / this.maxSpeed;
                    gap -= difficultyUp * 30;
                    min += difficultyUp * 30;
                    this.createPipe(gap, min, range, 64, '/assets/flap/pipe.png', false);
                    this.distanceSincePipe -= this.distanceBetweenPipes;
                };     
            }
            else if (this.state == 1) {
                if (this.distanceSincePipe > this.distanceBetweenPipes2) {

                    this.createPipe(700, 205, 230, 32, '/assets/flap/minipipe.png', true);
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

        // When we game over
        else {
            this.children[(this.children).length-1].visible = true;
        }
    }
}
