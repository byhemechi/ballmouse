import LeaderboardPopup from './components/leaderboardPopup'
import Game from './games/stopboat'

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
                <td><kbd>Z</kbd></td>
                <td>Shoot</td>
            </tr>
            <tr>
                <td><kbd>X</kbd></td>
                <td>Blitz attack (when charged)</td>
            </tr>
            <tr>
                <td><kbd>&uarr;</kbd><kbd>&darr;</kbd></td>
                <td>Move</td>
            </tr>
            <tr>
                <td><kbd>&larr;</kbd><kbd>&rarr;</kbd></td>
                <td>Choose weapon</td>
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

requestAnimationFrame(render)

export { render }
