import Game from './base'
import Root from '../objects/stopboat/root'
import { Game as LeaderboardGame } from '../protos/leaderboard_pb'

export default class Shootup extends Game {
    score: number = 0
    root: Root = new Root({})

    constructor() {
        super(1024, 576)
        this.el.style.backgroundColor = '#275a75'

        this.leaderboardGame = LeaderboardGame.STOPBOAT
        this.minScore = 100
    }
    render() {
        const ctx = this.ctx
        super.render()
        ctx.font = '24px Courier New'
        ctx.fillText('Score: ' + this.score.toString(), 700, 10)
    }
}
