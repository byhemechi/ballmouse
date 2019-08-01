import Entity from "../../primitives/entity";
import Player from "./player";
import Enemy from "./ememy";
import { Vector } from "../../types";
import Rect from "../../primitives/rect";


export default class Root extends Entity {

    speed = 250;

    distanceSinceLastCactus = 0;

    distanceToCactus = 750;

    cactusContainer = new Entity;

    player = new Player;

    constructor(...args) {
        super(args);
        this.children = [this.player,this.cactusContainer,
            new Rect({
            fill: '#000',
            size:new Vector(1024,10),
            position:new Vector(0,440)
        })]
    }

    tick(delta) {
        this.speed += 5 * delta
        super.tick(delta);
        this.distanceSinceLastCactus += this.speed*delta
        this.speed += 5 * delta

        if (this.distanceSinceLastCactus > this.distanceToCactus){
            this.distanceSinceLastCactus -= this.distanceToCactus;

            const cactus = new Enemy({
                position: new Vector(1024,340)
            });

            this.cactusContainer.children.push(cactus)
        }
    }
}