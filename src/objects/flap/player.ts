// Import classes
import Entity from '../../primitives/entity'
import Sprite from '../../primitives/sprite'
import Corpse from './corpse'
import { Vector } from '../../types'
import { getSound, playSound } from '../../sound'
import client from '../../leaderboard'
import {
    Game,
    Score,
    ScoreSubmissionRequest,
} from '../../protos/leaderboard_pb'
import flap from '../../games/flap'

export default class Player extends Entity {
    velocity = 0

    velocityX: number = 0

    gravity = 1700
    copterSpeed = 1700
    copterGravity = 1500

    alive = true

    sounds: Object = {}

    flapSound: ArrayBuffer

    jumpJustPressed: boolean = false

    flapSprites = new Sprite({
        src: '/assets/flap/flap.png',
        size: new Vector(64, 64),
        position: new Vector(-32, -32),
        region: {
            begin: new Vector(),
            size: new Vector(128, 128),
        },
    })

    copterSprites = new Sprite({
        src: '/assets/hoverbored/coolguy.png',
        size: new Vector(32, 34),
        position: new Vector(-16, -23),
        visible: false,
        region: {
            begin: new Vector(0, 0),
            size: new Vector(64, 68),
        },
        children: [
            new Entity({
                position: new Vector(16, 17),
                children: [
                    new Sprite({
                        src: '/assets/hoverbored/hand.png',
                        position: new Vector(22, -4),
                        size: new Vector(36 * 0.75, 18 * 0.75),
                    }),
                    new Sprite({
                        src: '/assets/hoverbored/hand2.png',
                        position: new Vector(-49, -4),
                        size: new Vector(27, 13),
                    }),
                    new Sprite({
                        src: '/assets/hoverbored/hoverboard.png',
                        position: new Vector(-94 / 4, 24),
                        size: new Vector(94 / 2, 32 / 2),
                    }),
                ],
            }),
        ],
    })

    children = [this.flapSprites, this.copterSprites]

    size = new Vector(0, 0) // Hitbox size

    state: number = 0 // Player state, 0: Flappy Bird, 1: Copter

    game: flap

    // Called when Player is created
    constructor(...args) {
        super(...args)
        this.reset()
        getSound('point', '/assets/flap/point.wav')
        getSound('flap', '/assets/flap/flap.wav')
        getSound('death', '/assets/flap/death.wav')
    }

    // Called every frame
    tick(delta) {
        this.jumpJustPressed = this.parent.jumpJustPressed

        if (this.alive && this.parent.started) {
            // Do proper gamemode logic
            if (this.state == 0) this.flapMode(delta)
            else if (this.state == 1) this.copterMode(delta)

            // Clamp y velocity
            this.velocity = Math.min(Math.max(this.velocity, -600), 600)
        } else if (!this.alive) this.deadMode(delta)

        super.tick(delta)
    }

    /**
     * Does flap mode logic.
     * @param {number} delta
     */
    flapMode(delta) {
        this.flapSprites.visible = true // Show normal sprites
        this.copterSprites.visible = false // Hide coptermode sprites

        // We add half gravity before and after movement to remove framerate dependance
        this.velocity += 0.5 * this.gravity * delta

        if (this.jumpJustPressed) {
            this.velocity = -600
            playSound('flap')
        }

        this.position.y += this.velocity * delta

        this.velocity += 0.5 * this.gravity * delta

        // Change player sprite to normal/flapping
        if (this.velocity < 0) this.flapSprites.region.begin.x = 128
        else this.flapSprites.region.begin.x = 0
    }

    /**
     * Does copter mode logic
     * @param {number} delta
     */
    copterMode(delta) {
        this.flapSprites.visible = false // Hide
        this.copterSprites.visible = true

        this.updateCopterVelocity(delta)
        this.position.y += this.velocity * delta
        this.updateCopterVelocity(delta)

        this.copterSprites.children[0].children[2].position.y +=
            ((this.game.keys.Space ? 18 : 24) -
                this.copterSprites.children[0].children[2].position.y) /
            3

        this.copterSprites.children[0].rotation = (0.4 * this.velocity) / 600
        ;[0, 1].forEach(i => {
            const hand = this.copterSprites.children[0].children[i]
            hand.rotation = this.velocity * 0.001 * (i == 0 ? -1 : 1)
            hand.position.y = this.velocity * -0.02
        })
    }

    /**
     * Does dead mode logic
     * @param {number} delta
     */
    deadMode(delta) {
        if (this.position.y < this.game.height + 50) {
            this.velocity += 0.5 * this.gravity * delta

            this.position.x += this.velocityX * delta
            this.position.y += this.velocity * delta

            this.velocity += 0.5 * this.gravity * delta

            this.rotation += delta * 4
        }
    }

    /**
     * Updates our velocity in copter mode
     * @param {number} delta
     */
    updateCopterVelocity(delta) {
        if (this.game.keys.Space || this.game.keys.ArrowUp) {
            // If we are going down, go up faster
            if (this.velocity > 0)
                this.velocity -= 1.25 * 0.5 * this.copterSpeed * delta
            // Otherwise, go up at normal speed
            else this.velocity -= 0.5 * this.copterSpeed * delta
        } else {
            // If we are going up, fall faster
            if (this.velocity < 0)
                this.velocity += 1.25 * 0.5 * this.copterGravity * delta
            // Otherwise, fall at normal speed
            else this.velocity += 0.5 * this.copterGravity * delta
        }
    }

    /** Sets player into death state */
    kill(speed) {
        if (this.alive) {
            this.alive = false
            playSound('death')
            this.velocity = -600
            this.velocityX = speed
            this.copterSprites.visible = false
            this.flapSprites.visible = true
            this.flapSprites.region.begin.x = 256
            this.spawnCorpse()

            this.game.acceptInput = false
        }
    }

    spawnCorpse() {
        const leftHand = new Corpse()
        leftHand.position.x = this.position.x
        leftHand.position.y = this.position.y
        leftHand.velocity.x = -240 + this.velocityX
        leftHand.velocity.y = -800
        leftHand.children[0].visible = false
        leftHand.children[2].visible = false
        leftHand.spin = -10

        const rightHand = new Corpse()
        rightHand.position.x = this.position.x
        rightHand.position.y = this.position.y
        rightHand.velocity.x = 240 + this.velocityX
        rightHand.velocity.y = -800
        rightHand.children[1].visible = false
        rightHand.children[2].visible = false
        rightHand.spin = 10

        this.parent.corpses.children.push(leftHand, rightHand)

        if (this.state == 1) {
            const feet = new Corpse()

            feet.position = this.position.add(new Vector(0, 8))
            feet.velocity.x = 30 + this.velocityX
            feet.velocity.y = -300
            feet.children[0].visible = false
            feet.children[1].visible = false
            feet.spin = -1

            feet.gravity = 800
            feet.dragX = 150

            this.parent.corpses.children.push(feet)
        }
    }

    /**
     * (Re)sets the player to the starting state
     */
    reset() {
        this.position.x = 200
        this.position.y = 200
        this.velocity = -600
        this.velocityX = 0
        this.rotation = 0
        this.alive = true
        this.state = 0
    }
}
