import client, { getLeaderboard } from '../leaderboard'
import { Game, LeaderboardRequest, Score } from '../protos/leaderboard_pb.js'

declare global {
    interface Document {
        startViewTransition: (callback: () => void) => void
    }
}

function loadGame(game) {
    const nscript = document.createElement('script')
    nscript.src = game.entry
    document.title = game.title
    document.body.appendChild(nscript)
}

const container: HTMLDivElement = document.querySelector('#menu')
async function generateMenu() {
    const menufetch = fetch('/menu.json')
    const menu = await menufetch
    const data = await menu.json()

    container.innerHTML = ''
    container.setAttribute('style', '')

    const menuHeader = document.createElement('h1')
    menuHeader.textContent = data.title
    container.appendChild(menuHeader)
    document.title = data.title

    data.games.forEach(game => {
        const newel = document.createElement('button')

        newel.onclick = e => {
            if ('startViewTransition' in document) {
                document.startViewTransition(() => {
                    createGameMenu(game)
                })
            } else {
                createGameMenu(game)
            }
        }

        newel.innerHTML = game.title

        container.appendChild(newel)
    })
}

window.onload = generateMenu

function createGameMenu(game) {
    container.innerHTML = ''

    container.style.background = game.background

    // Game Icon
    const icon = new Image()
    icon.src = game.icon
    container.appendChild(icon)

    // Game title
    const title = document.createElement('h1')
    title.textContent = game.title
    container.appendChild(title)

    // Play button
    const play = document.createElement('button')
    play.textContent = 'Play'
    play.onclick = e => {
        if ('startViewTransition' in document) {
            document.startViewTransition(() => {
                loadGame(game)
                container.parentElement.removeChild(container)
            })
        } else {
            loadGame(game)
            container.parentElement.removeChild(container)
        }
    }
    container.appendChild(play)

    // Back button
    const back = document.createElement('button')
    back.textContent = 'Back'
    back.className = 'back'
    back.onclick = generateMenu
    container.appendChild(back)
}
