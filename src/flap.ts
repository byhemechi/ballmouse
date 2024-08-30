import LeaderboardPopup from './components/leaderboardPopup'
import Game from './games/flap'

const el = document.querySelector('#game')
const leaderboard = document.querySelector(
    'game-leaderboard'
) as LeaderboardPopup
const game = new Game()
game.leaderboardPopup = leaderboard
leaderboard.game = game

el.appendChild(game.el)

document.querySelector('#instructions').innerHTML = `            
    <table>
        <tbody>
            <tr>
                <td><kbd style="font-family: inherit; font-size: 0.8rem; color: #aaa; padding-left: 0.75em; padding-right: 0.75em;">SPACE</kbd></td>
                <td>Jump</td>
            </tr>
        </tbody>
    </table>`

const startTime = performance.now()

/**
 * The entry render function, used only in this file for requestAnimationFrame
 * @param {number} time Time in ms since first frame rendered. This is automatically inserted by `requestAnimationFrame`
 */
function render() {
    game.render()
    requestAnimationFrame(render)
}

requestAnimationFrame(render)
setInterval(() => {
    const now = performance.now()

    game.tick(now - startTime)
}, 1000 / 60)

export { render }
