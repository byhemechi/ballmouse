import Entity from "../../primitives/entity";
import Player from "./player";
import Enemy from "./ememy";
import { Vector } from "../../types";
import Rect from "../../primitives/rect";


export default class Root extends Entity {

    speed = 250;

    maxSpeed = 666

    distanceSinceLastCactus = 0;

    distanceTravelled = 0;

    distanceToCactus = 750;

    cactusContainer = new Entity;

    player = new Player;

    constructor(...args) {
        super(args);
        this.children = [this.player, this.cactusContainer,
        new Rect({
            fill: '#000',
            size: new Vector(1024, 1),
            position: new Vector(0, 440)
        })]
    }

    tick(delta) {
        this.speed += 5 * delta
        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed
        super.tick(delta);
        this.distanceSinceLastCactus += this.speed * delta
        this.distanceTravelled += this.speed * delta
        this.game.score = (this.distanceTravelled / 10).toFixed(0)
        this.speed += 5 * delta

        if (this.distanceSinceLastCactus > this.distanceToCactus) {
            this.distanceSinceLastCactus -= this.distanceToCactus;
            this.distanceToCactus = Math.random()*1000 + 500

            const cactus = new Enemy({
                position: new Vector(1024, 350)
            });

            this.cactusContainer.children.push(cactus)
        }
    }
    gameOver() {
        this.maxSpeed = 0
        this.speed = 0
        this.player.velocity = 0
        this.player.isGrounded = false
        this.player.gravity = 0
    }
    reset() {
        for (let i = this.cactusContainer.children.length - 1; i >= 0; i--) {
            this.cactusContainer.children[i].free()
        }
        this.maxSpeed = 666
        this.player.gravity = 1300
        this.player.position.y = 420
        this.speed = 250
        this.distanceTravelled = 0
    }
}