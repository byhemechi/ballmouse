// Import classes
import Entity from "../../primitives/entity";
import Rect from "../../primitives/rect";
import { Vector } from "../../types";
import Sprite from "../../primitives/sprite";
import Player from "./player"
import Boat from "./boat";

export default class Root extends Entity {

    player = new Player

    bullets = new Entity;

    enemyBullets = new Entity;

    boats = new Entity;

    children = [this.player, this.bullets, this.enemyBullets, this.boats];

    boatSpawnTimer = 0;
    timeUntilNextBoat = 1;
    
    tick(delta) {
        super.tick(delta);

        // Bullets offscreen are cleared after collision is done
        this.bullets.children.forEach(i => {
            i.clear();
        });

        this.boatSpawnTimer += delta;
        this.spawnBoat()
    }

    spawnBoat() {
        if (this.boatSpawnTimer > this.timeUntilNextBoat) {
            this.boatSpawnTimer -= this.timeUntilNextBoat;
            this.timeUntilNextBoat = 1 + Math.random() * 1;
            
            const boat = new Boat;

            boat.position = new Vector(1024, Math.random() * 576);

            const rotation = (Math.random() - 0.5) * 2 * Math.PI / 6 + Math.PI;

            boat.rotation = rotation;
            boat.velocity = new Vector(Math.cos(rotation), Math.sin(rotation));

            this.boats.children.push(boat);
        }
    }

}

