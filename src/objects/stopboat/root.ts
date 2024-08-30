// Import classes
import Entity from '../../primitives/entity'
import Rect from '../../primitives/rect'
import { Vector } from '../../types'
import Sprite from '../../primitives/sprite'
import Player from './player'
import Boat from './boat'
import UI from './ui'
import Label from '../../primitives/text'
import Shootup from '../../games/stopboat'

export default class Root extends Entity {
    gameStarted = false

    scoreMultiplier = 1
    maxScoreMultiplier = 5

    ui = new UI()

    game: Shootup

    music = new Audio('/assets/stopboat/bgm.ogg')

    player = new Player()
    bullets = new Entity({
        children: [],
    })
    enemyBullets = new Entity()
    boats = new Entity()

    gameOver = new Label({
        value: 'PRESS Z TO START',
        font: '32px sans-serif',
        position: new Vector(125, 260),
    })

    children = [
        this.bullets,
        new Sprite({
            src: '/assets/stopboat/decking.jpg',
            size: new Vector(576, 576),
            position: new Vector(-465, 0),
        }),
        this.player,
        this.enemyBullets,
        this.boats,
        this.ui,
        this.gameOver,
    ]

    boatSpawnTimer = 0
    timeUntilNextBoat = 1.25
    waveTimer = 0
    nextWaveStart = 10
    nextWaveEnd = 12.5
    waveSpawnRate = 0.35

    // Pressing Z 0.5 second after death will not reset game
    endGameTime = 0.5
    endGameTimer = 0

    constructor(...args) {
        super(args)
        this.music.loop = true
    }

    tick(delta) {
        super.tick(delta)

        // Bullets offscreen are cleared after collision is done

        for (let i = this.bullets.children.length - 1; i >= 0; i--) {
            this.bullets.children[i].clear()
        }

        for (let i = this.enemyBullets.children.length - 1; i >= 0; i--) {
            this.enemyBullets.children[i].clear()
        }

        if (this.gameStarted) {
            this.boatSpawnTimer += delta
            this.waveTimer += delta
            this.spawnBoats()

            if (this.player.health < 0) {
                this.endGame()
            }
        } else {
            // If Z is just pressed and endGameTimer is zero
            if (this.game.keyJustPressed('KeyZ') && !this.endGameTimer)
                this.reset()
        }

        // Decrease timer
        if (this.endGameTimer) this.endGameTimer -= delta
        if (this.endGameTimer < 0) this.endGameTimer = 0
    }

    endGame() {
        this.gameOver.visible = true
        this.gameStarted = false
        this.music.pause()
        this.music.currentTime = 0
        this.endGameTimer = this.endGameTime

        this.game.submitScore()
    }

    /**
     * Attempt to spawn boats in
     */
    spawnBoats() {
        if (this.waveTimer > this.nextWaveEnd) {
            this.waveTimer -= this.nextWaveEnd
            this.increaseDifficulty()
        } else if (this.waveTimer > this.nextWaveStart) {
            if (this.boatSpawnTimer > this.waveSpawnRate) {
                this.boatSpawnTimer -= this.waveSpawnRate
                this.createBoat()
            }
        } else if (this.boatSpawnTimer > this.timeUntilNextBoat) {
            this.boatSpawnTimer -= this.timeUntilNextBoat
            this.createBoat()
        }
    }

    /**
     * Increases the difficulty of the game
     */
    private increaseDifficulty() {
        this.nextWaveStart -= 0.3
        this.nextWaveEnd -= 0.25
        this.timeUntilNextBoat -= 0.1
        this.waveSpawnRate -= 0.02

        this.nextWaveStart = Math.max(this.nextWaveStart, 10)
        this.nextWaveEnd = Math.max(this.nextWaveStart, 14)
        this.timeUntilNextBoat = Math.max(this.timeUntilNextBoat, 0.5)
        this.waveSpawnRate = Math.max(this.waveSpawnRate, 0.15)
    }

    private createBoat() {
        const boat = new Boat()

        boat.position = new Vector(1024, Math.random() * 576)
        const rotation = ((Math.random() - 0.5) * 2 * Math.PI) / 6 + Math.PI
        boat.rotation = rotation
        boat.velocity = new Vector(Math.cos(rotation), Math.sin(rotation))

        this.boats.children.push(boat)
    }

    giveLootToPlayer(reward) {
        const playerAmmo = this.player.ammo

        for (var i = 0; i < Math.min(playerAmmo.length, reward.length); i++) {
            playerAmmo[i] += reward[i]
        }
    }

    increaseScoreMultiplier(amount: number) {
        this.scoreMultiplier += amount
        this.scoreMultiplier = Math.min(
            Math.max(this.scoreMultiplier, 1),
            this.maxScoreMultiplier
        )
    }

    reset() {
        this.gameOver.visible = false
        this.player.reset()
        this.gameStarted = true
        this.music.play()
        this.scoreMultiplier = 1
        this.boatSpawnTimer = 0
        this.timeUntilNextBoat = 1.25
        this.waveTimer = 5
        this.nextWaveStart = 13
        this.nextWaveEnd = 17
        this.waveSpawnRate = 0.35
        this.game.score = 0

        for (let i = this.boats.children.length - 1; i > -1; i--) {
            this.boats.children[i].free()
        }

        for (let i = this.bullets.children.length - 1; i > -1; i--) {
            this.bullets.children[i].free()
        }

        for (let i = this.enemyBullets.children.length - 1; i > -1; i--) {
            this.enemyBullets.children[i].free()
        }
    }
}
