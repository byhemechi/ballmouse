// Import classes
import Entity from "../../primitives/entity";
import Rect from "../../primitives/rect";
import { Vector } from "../../types";
import Sprite from "../../primitives/sprite";
import Player from "./player"
import Boat from "./boat";
import UI from "./ui";

export default class Root extends Entity {

    scoreMultiplier = 1;
    maxScoreMultiplier = 5;

    ui = new UI;

    firstFrame = true;

    player = new Player

    bullets = new Entity;

    enemyBullets = new Entity;

    boats = new Entity;

    children = [this.bullets, this.player, this.boats, this.enemyBullets, this.ui];

    boatSpawnTimer = 0;
    timeUntilNextBoat = 1.25;
    waveTimer = 0;
    nextWaveStart = 10;
    nextWaveEnd = 12.5;
    waveSpawnRate = 0.2;
    
    tick(delta) {
        super.tick(delta);

        // Bullets offscreen are cleared after collision is done
        this.bullets.children.forEach(i => {
            i.clear();
        });
        this.enemyBullets.children.forEach(i => {
            i.clear();
        });

        this.boatSpawnTimer += delta;
        this.waveTimer += delta;
        this.spawnBoats()
    }

    /**
     * Attempt to spawn boats in
     */
    spawnBoats() {
        if (this.waveTimer > this.nextWaveEnd) {
            this.waveTimer -= this.nextWaveEnd;
            this.increaseDifficulty()
        } else if (this.waveTimer > this.nextWaveStart) {
            if (this.boatSpawnTimer > this.waveSpawnRate) {
                this.boatSpawnTimer -= this.waveSpawnRate;
                this.createBoat()
            }
        } else if (this.boatSpawnTimer > this.timeUntilNextBoat) {
            this.boatSpawnTimer -= this.timeUntilNextBoat;
            this.createBoat();
        }
    }

    private increaseDifficulty() {
        this.nextWaveStart -= 0.5;
        this.boatSpawnTimer -= 0.05;

        this.nextWaveStart = Math.max(this.nextWaveStart, 6.5);
        this.boatSpawnTimer = Math.max(this.boatSpawnTimer, 0.25)
    }

    private createBoat() {
        const boat = new Boat;
        boat.position = new Vector(1024, Math.random() * 576);
        const rotation = (Math.random() - 0.5) * 2 * Math.PI / 6 + Math.PI;
        boat.rotation = rotation;
        boat.velocity = new Vector(Math.cos(rotation), Math.sin(rotation));
        this.boats.children.push(boat);
    }

    giveLootToPlayer(reward) {
        const playerAmmo = this.player.ammo;

        for (var i = 0; i < Math.min(playerAmmo.length, reward.length); i++) {
            playerAmmo[i] += reward[i];
        }
    }

    increaseScoreMultiplier(amount: number) {
        this.scoreMultiplier += amount;
        this.scoreMultiplier = Math.min(Math.max(this.scoreMultiplier, 1), this.maxScoreMultiplier)
    }

}

