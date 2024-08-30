import Entity from '../primitives/entity'
import { ScoreSubmissionRequest } from '../protos/leaderboard_pb'
import { Game as LeaderboardGame } from '../protos/leaderboard_pb'
import client, { getLeaderboard, getPlayerName } from '../leaderboard'
import LeaderboardPopup from '../components/leaderboardPopup'

const submissionForm = document.querySelector(
    'form#submit_score'
) as HTMLFormElement
customElements.define('game-leaderboard', LeaderboardPopup)

interface KeySet {
    [key: string]: boolean
}
class Game {
    el: HTMLCanvasElement = document.createElement('canvas')
    ctx: CanvasRenderingContext2D = this.el.getContext('2d')
    lt = 0
    keys: KeySet = {}
    lk: KeySet = {}
    delta: number
    fps: number

    width: number
    height: number

    score: number
    minScore: number

    canSubmit = true

    acceptInput = true

    leaderboardGame: LeaderboardGame
    leaderboardPopup: LeaderboardPopup

    root: Entity = new Entity({})
    /**
     * The main tick function, called every frame.
     * @param {Number} time Time in ms from the first run (not really but close enough)
     */

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
        this.el.width = this.width * devicePixelRatio
        this.el.height = this.height * devicePixelRatio

        this.el.style.width = width + 'px'
        this.el.style.height = height + 'px'

        submissionForm.onsubmit = e => {
            e.preventDefault()
            this.doSubmit(e)
        }

        document.addEventListener('keydown', e => {
            if (this.acceptInput) this.keys[e.code] = true
        })
        document.addEventListener('keyup', e => {
            delete this.keys[e.code]
        })
    }
    tick(time) {
        const fps = 1000 / (time - this.lt)
        const delta = Math.min(2, (time - this.lt) / 1000)
        this.delta = delta
        this.fps = fps
        this.lt = time
        this.root.game = this
        this.root.tick(delta)
        this.lk = JSON.parse(JSON.stringify(this.keys))
    }

    render() {
        const ctx = this.ctx
        ctx.resetTransform()
        this.ctx.scale(devicePixelRatio, devicePixelRatio)
        ctx.clearRect(0, 0, this.el.width, this.el.height)
        this.root.render(ctx)
    }

    keyJustPressed(key: string) {
        var justPressed: boolean
        if (this.keys[key] && !this.lk[key]) {
            justPressed = true
        } else {
            justPressed = false
        }

        return justPressed
    }

    keyJustReleased(key: string) {
        var justReleased: boolean
        if (!this.keys[key] && this.lk[key]) {
            justReleased = true
        } else {
            justReleased = false
        }

        return justReleased
    }

    private async doSubmit(e: Event) {
        e.preventDefault()
        if (!this.canSubmit) return
        this.canSubmit = false

        const data = new FormData(submissionForm)

        const name = data.get('name').toString()
        localStorage.setItem('player-name', name)

        if (!name) return

        const req = new ScoreSubmissionRequest()
        req.setScore(this.score)
        req.setGame(this.leaderboardGame)
        req.setName(name)

        await client.submitScore(req)
        submissionForm.style.display = 'none'

        this.leaderboardPopup.reloadScores()
    }

    async submitScore() {
        this.canSubmit = true
        if (this.leaderboardGame == undefined) return
        this.acceptInput = false

        const nameInput = submissionForm.querySelector('input')
        if (this.score > this.minScore) {
            submissionForm.style.display = 'flex'

            nameInput.value = localStorage.getItem('player-name') || ''
            submissionForm
                .querySelector('button')
                .setAttribute('data-score', this.score.toString())
        } else submissionForm.style.display = 'none'

        this.leaderboardPopup.show()
        nameInput.focus()
    }
}

export default Game
