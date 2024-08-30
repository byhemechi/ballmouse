import Game from './base'
import Root from '../objects/flap/root'
import { Game as LeaderboardGame } from '../protos/leaderboard_pb'

export default class flap extends Game {
    root: Root
    score: number = 0

    constructor() {
        super(720, 480)
        this.leaderboardGame = LeaderboardGame.FLAPPY_GUY
        this.minScore = 2
        this.root.children = [new Root()]
        this.el.style.backgroundImage =
            'linear-gradient(rgb(211, 228, 255), skyblue, skyblue)'
    }
    render() {
        const ctx = this.ctx
        super.render()
        ctx.font = '32px sans-serif'
        ctx.fillText(this.score.toString(), 100, 100)
    }
    tick(time) {
        super.tick(time)
    }
}
