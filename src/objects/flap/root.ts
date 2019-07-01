// Import classes
import Entity from "../../primitives/entity";
import Pipe from "./pipe";
import Player from "./player";
import Rect from "../../primitives/rect";
import { Vector } from "../../types";
import Label from "../../primitives/text";
import { playSound } from "../../sound";

export default class Root extends Entity {

    player = new Player;

    maxSpeed = 600;

    pipeSet = new Entity;

    started = false;

    speed: number;

    stateCount: number = 2;
    state: number;

    distanceBetweenPipes = 450;
    distanceBetweenPipes2 = 45;
    distanceBetweenPortal = 450 * 2;
    distanceSincePoint: number;
    distanceSincePipe: number;
    distanceSinceStateChange: number;
    distanceSincePortal: number

    prevJump = false; // Space state on last frame
    jumpJustPressed = false;

    constructor(...args) {
        super(...args);
        this.reset();
        this.children = [
            this.pipeSet,
            new Rect({
                position: new Vector(0, 440),
                size: new Vector(720, 40),
                fill: 'tan'
            }), this.player, new Label({
                value: "Flappy Guy",
                font: "32px sans-serif",
                position: new Vector(360, 240),
                baseline: "middle",
                align: "center"
            })
        ]
    }


    // Smooth random number generator 
    slidingRandom = [0.5, 0.5, 0.5, 0.5];

    /**
     * Create a random value smoothed by previous outputs
     */
    newSlidingRandom() {
        this.slidingRandom.push(Math.random()); // Add a new random number to slidingRandom
        this.slidingRandom.shift(); // Remove the first value of slidingRandom
        var total = 0.0;
        for (var i = 0; i < this.slidingRandom.length; ++i) {
            total += this.slidingRandom[i];
        }
        return total / this.slidingRandom.length // Return average of slidingRandom
    }

    // Called every frame
    tick(delta) {

        // Input if jump pressed this frame
        this.jumpJustPressed = this.isInitialJump();
        this.player.jumpJustPressed = this.jumpJustPressed;

        // If we press jump and game has ended, reset the game
        if (this.jumpJustPressed && !this.started) this.reset();

        // Do player and pipe movements before collision
        super.tick(delta);

        if (this.started) {
            this.pipeCollision();

            this.ceiling_groundCollision();

            this.increaseSpeed(delta);

            this.counters(delta);

            this.setState();

            this.addPipes();

            this.updateScore();

        } else {
            // Show gameover text
            this.children[(this.children).length - 1].visible = true;
        }
    }

    /**
     * Increase speed as we progress further
     * @param {number} delta 
     */
    increaseSpeed(delta: number) {
        if (this.speed < this.maxSpeed && this.player.alive) {
            this.speed += delta * 6;
        }
        if (this.speed >= this.maxSpeed && this.player.alive) {
            this.speed = this.maxSpeed;
        }
    }

    /**
     * Check if this is the first frame where jump is pressed
     */
    isInitialJump() {
        var didJump
        if (this.game.keys.Space && !this.prevJump) {
            didJump = true;
        } else {
            didJump = false;
        }
        this.prevJump = this.game.keys.Space;
        return didJump;
    }

    /**
     * Update the score counter to reflect the current game state
     */
    updateScore() {
        if (this.distanceSincePoint > this.distanceBetweenPipes) {
            playSound("point")
            this.game.score++;
            this.distanceSincePoint -= this.distanceBetweenPipes;
        }
    }
    /**
     * Add pipes where required
     */
    addPipes() {
        if (this.state == 0) {
            if (this.distanceSincePipe > this.distanceBetweenPipes) {
                this.distanceSincePipe -= this.distanceBetweenPipes;

                // New pipe variables
                var gap = 650;
                var min = 140;
                var range = 230;
                var size = 64;

                var difficultyUp = this.speed / this.maxSpeed;
                gap -= difficultyUp * 30;
                min += difficultyUp * 30;

                this.createPipe(gap, min, range, size, 0, this.distanceSincePipe, false);
            };
        } else if (this.state == 1) {
            if (this.distanceSincePipe > this.distanceBetweenPipes2) {
                this.distanceSincePipe -= this.distanceBetweenPipes2;

                // New pipe variables
                var gap = 700;
                var min = 205;
                var range = 230;
                var size = 32;
                
                this.createPipe(gap, min, range, size, 1, this.distanceSincePipe, true);
            }
        }
    }

    /**
     * Set the game state to the appropriate style (hoverbored or flap)
     */
    setState() {
        // Change game state
        if (this.distanceSinceStateChange > this.distanceBetweenPortal) {
            
            this.state = (this.state + 1) % this.stateCount;
            this.distanceSincePipe = 0;

            this.distanceSinceStateChange -= this.distanceBetweenPortal;
        }
        // Change player state
        if (this.distanceSincePortal > this.distanceBetweenPortal) {
            this.player.state = (this.player.state + 1) % this.stateCount;
            // Clamp player velocity when entering copter mode
            if (this.state == 1) this.player.velocity = Math.min(Math.max(this.player.velocity, -200), 200);

            this.distanceSincePortal -= this.distanceBetweenPortal;
        }
    }

    /**
     * Update distance counters
     * @param {number} delta 
     */
    counters(delta) {
        this.distanceSincePipe += this.speed * delta;
        this.distanceSincePoint += this.speed * delta;
        this.distanceSincePortal += this.speed * delta;
        this.distanceSinceStateChange += this.speed * delta;
    }
    /**
     * Check if the player is colliding with the ceiling or ground
     */
    ceiling_groundCollision() {
        if (this.player.position.y < 0 || this.player.position.y > this.game.el.height - 60) {
            this.player.kill()
            this.speed = 0;
            this.started = false;
        }
    }

    /**
     * Check if the player is colliding with the pipes
     */
    pipeCollision() {
        // Pipe collision
        this.pipeSet.children.forEach(i => {
            // Minkowski Difference collision

            const minX = this.player.position.x - (i.position.x + i.size.x);
            const maxX = this.player.position.x + this.player.size.x - i.position.x;
            const minY = this.player.position.y - (i.position.y + i.size.y);
            const maxY = this.player.position.y + this.player.size.y - i.position.y;
            if (minX < 0 && maxX > 0 && minY < 0 && maxY > 0) {
                this.player.kill()
                this.speed = 0;
                this.started = false;
            }
        });
    }

    /**
     * Creates a new pipe
     * @param {number} width The size of the gap between pipes
     * @param {number} min The minimum distance of bottom pipe from the top of the screen
     * @param {number} range The range where the pipes can move
     * @param {number} size Size of the hitbox for the pipe
     * @param {number} sprite ID of sprite to use
     * @param {number} xOffset How much we should offset the x position of the pipe
     * @param {bool} useSlidingRandom Should the position be smoothed
     */
    createPipe(width, min, range, size, sprite, xOffset, useSlidingRandom) {

        var bottomTop = true; // Flag for if we should create bottom or top pipe
        var recycled = false; // Flag if we recycled pipes
        var bottomPipePosition = 0; // Position of bottom pipe

        // Attempt to recycle pipes
        this.pipeSet.children.forEach(i => {
            if (i.isFree) {
                // Raise flag that we recycled
                recycled = true;

                // Generate bottom and top pipe
                if (bottomTop) {
                    // Generate new position based on if we should use sliding random, and offset x position
                    if (useSlidingRandom) i.position = new Vector(720 - xOffset, min + this.newSlidingRandom() * range);
                    else i.position = new Vector(720 - xOffset, min + Math.random() * range);

                    // Show appropriate sprite
                    if (sprite == 0) {
                        i.children[0].visible = true;
                        i.children[1].visible = false;
                    }
                    else if (sprite == 1) {
                        i.children[0].visible = false;
                        i.children[1].visible = true;
                    }
                    i.size.x = size;                    // Set size of pipe
                    i.isFree = false;                   // Flag pipe as active
                    i.visible = true;                   // Make pipe visible
                    bottomPipePosition = i.position.y;  // Store position of bottom pipe
                    bottomTop = false;
                } else {
                    // Set top pipe position to bottom pipe position minus distance between pipes, and offset x position
                    i.position = new Vector(720 - xOffset, bottomPipePosition - width);

                    // Show appropriate sprite
                    if (sprite == 0) {
                        i.children[0].visible = true;
                        i.children[1].visible = false;
                    }
                    else if (sprite == 1) {
                        i.children[0].visible = false;
                        i.children[1].visible = true;
                    }
                    i.size.x = size                     // Set size of pipe
                    i.isFree = false;                   // Flag pipe as active
                    i.visible = true;                   // Make pipe visible

                }
            }
        });

        // Create new pipes if no free pipes are available
        if (!recycled) {
            // Create new top and bottom pipes
            var bottomPipe = new Pipe;
            var topPipe = new Pipe;

            // Show appropriate sprite
            if (sprite == 0) {
                bottomPipe.children[0].visible = true;
                bottomPipe.children[1].visible = false;

                topPipe.children[0].visible = true;
                topPipe.children[1].visible = false;
            }
            else if (sprite == 1) {
                console.log('yee')
                bottomPipe.children[0].visible = false;
                bottomPipe.children[1].visible = true;

                topPipe.children[0].visible = false;
                topPipe.children[1].visible = true;
            }

            bottomPipe.size = new Vector(size, 500);    // Set size of bottom pipe
            topPipe.size = new Vector(size, 500);       // Set size of top pipe

            bottomPipe.position.x = 720 - xOffset;
            if (useSlidingRandom) bottomPipe.position.y = min + this.newSlidingRandom() * range;
            else bottomPipe.position.y = min + Math.random() * range;
            topPipe.position = new Vector(720 - xOffset, bottomPipe.position.y - width);
            this.pipeSet.children.unshift(bottomPipe, topPipe);
        }
    }

    
    /** 
     * Reset the game back to its' default state
     */
    reset() {
        if (this.jumpJustPressed && !this.started) {
            this.children[(this.children).length - 1].visible = false;
            this.player.reset();
            this.started = true;
            this.speed = 200;
            this.game.score = 0;
            this.distanceSincePipe = 450;
            this.distanceSincePortal = -540;
            this.distanceSincePoint = -540 + 450;
            this.distanceSinceStateChange = 0;
            this.state = 0;

            // Disable all pipes
            this.pipeSet.children.forEach(i => {
                i.isFree = true;
                i.visible = false;
                i.position.x = -50;
            });
        }
    }
}