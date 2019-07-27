// Import classes
import Entity from "../../primitives/entity";
import Rect from "../../primitives/rect";
import { Vector } from "../../types";
import Sprite from "../../primitives/sprite";
import Player from "./player"
import Boat from "./boat";
import UI from "./ui";

export default class Root extends Entity {

    gameStarted = false;

    scoreMultiplier = 1;
    maxScoreMultiplier = 5;

    ui = new UI;

    music = new Audio('/assets/stopboat/boss1.ogg');

    player = new Player;
    bullets = new Entity({
        children: []
    });
    enemyBullets = new Entity;
    boats = new Entity;

    children = [this.bullets, this.player, this.boats, this.enemyBullets, this.ui];

    boatSpawnTimer = 0;
    timeUntilNextBoat = 1.25;
    waveTimer = 0;
    nextWaveStart = 10;
    nextWaveEnd = 12.5;
    waveSpawnRate = 0.35;

    constructor(...args) {
        super(args);
        this.music.loop = true;

    }
    
    tick(delta) {
        super.tick(delta);

        // Bullets offscreen are cleared after collision is done

        for (var i = this.bullets.children.length - 1; i >= 0; i--) {
            this.bullets.children[i].clear();
        }

        for (var i = this.enemyBullets.children.length - 1; i >= 0; i--) {
            this.enemyBullets.children[i].clear();
        }


        if (this.gameStarted) {
            this.boatSpawnTimer += delta;
            this.waveTimer += delta;
            this.spawnBoats()

            if (this.player.health < 0) {
                this.endGame()
            }
        } else {
            if (this.game.keyJustPressed('KeyZ')) this.reset();
        }
    }

    endGame() {
        this.gameStarted = false;
        this.music.pause();
        this.music.currentTime = 0;
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
        this.nextWaveEnd -= 0.3;
        this.boatSpawnTimer -= 0.05;
        this.waveSpawnRate -= 0.03;

        this.nextWaveStart = Math.max(this.nextWaveStart, 4);
        this.nextWaveEnd = Math.max(this.nextWaveStart, 9);
        this.boatSpawnTimer = Math.max(this.boatSpawnTimer, 0.25);
        this.waveSpawnRate = Math.max(this.waveSpawnRate, 0.15);
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

    reset() {
        this.gameStarted = true;
        this.music.play()
        this.scoreMultiplier = 1;
        this.player.health = this.player.maxHealth;
        this.boatSpawnTimer = 0;
        this.timeUntilNextBoat = 1.25;
        this.waveTimer = 0;
        this.nextWaveStart = 10;
        this.nextWaveEnd = 12.5;
        this.waveSpawnRate = 0.35;

        for (var i = this.boats.children.length - 1; i > -1; i--) {
            this.boats.children[i].free();
        }

        for (var i = this.bullets.children.length - 1; i > -1; i--) {
            this.bullets.children[i].free();
        }

        for (var i = this.enemyBullets.children.length - 1; i > -1; i--) {
            this.enemyBullets.children[i].free();
        }

    }

}

