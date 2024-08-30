import Game from '../games/base'
import { getLeaderboard } from '../leaderboard'

const popupTemplate = document.querySelector(
    'template#leaderboard-popup'
)! as HTMLTemplateElement
const rowTemplate = document.querySelector(
    'template#score-row'
)! as HTMLTemplateElement

const css = (chunks: TemplateStringsArray, ...values: string[]) => {
    const style = document.createElement('style')
    style.innerHTML = chunks.reduce(
        (prev, current, n) =>
            prev + current + (n < values.length ? values[n] : ''),
        ''
    )

    return style
}

const styles = css`
    dialog {
        border-radius: 1em;
        border: 0;
        padding: 32px;
        width: max-content;
        font-family: sans-serif;
        position: relative;
    }

    dialog button {
        position: absolute;
        top: 1em;
        right: 1em;
        width: 2em;
        height: 2em;
    }
    dialog table {
        width: 100%;
        border-collapse: collapse;
    }

    dialog table th,
    dialog table td {
        border: solid 1px #eee;
        padding: 0.5em;
        text-align: left;
        white-space: nowrap;
    }
`

export default class LeaderboardPopup extends HTMLElement {
    // table = new document.

    game: Game
    popup: HTMLDialogElement

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' })
        const showButton = document.createElement('button')

        shadow.appendChild(styles)

        showButton.textContent = 'High scores'
        shadow.appendChild(showButton)
        showButton.addEventListener('click', () => this.show())

        this.popup = document.createElement('dialog')
        const popup = this.popup

        shadow.appendChild(popup)

        popup.addEventListener('close', e => {
            this.game.acceptInput = true
        })
        const popupBody = popupTemplate.content.cloneNode(true)
        popup.prepend(popupBody)

        const closeButton = popup.querySelector('button')

        closeButton.tabIndex = 2
        closeButton.addEventListener('click', () => popup.close())
    }

    public async reloadScores() {
        const tbody = this.popup.querySelector('tbody')
        tbody.innerHTML = ''

        for await (const score of getLeaderboard(this.game.leaderboardGame)) {
            const row = rowTemplate.content.cloneNode(true)

            for (let i = 0; i < row.childNodes.length; ++i) {
                const el = row.childNodes[i]
                if (!(el instanceof HTMLTableRowElement)) continue
                el.children[0].textContent = score.getRank().toLocaleString()
                el.children[1].textContent = score.getName()
                el.children[2].textContent = score.getScore().toLocaleString()
                el.children[3].textContent = new Date(
                    score.getTimestamp()
                ).toLocaleString()
            }

            tbody.appendChild(row)
        }
    }

    public async show() {
        this.popup.showModal()

        this.reloadScores()
    }

    hide() {
        this.popup.close()
    }
}
