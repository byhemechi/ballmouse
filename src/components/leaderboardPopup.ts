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
    body {
        background: #235169;
    }
    dialog {
        overflow: hidden;
        border-radius: 0.75rem;
        border-width: 0px;
        padding: 0px;
        font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji',
            'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
            0 8px 10px -6px rgb(0 0 0 / 0.1);
        --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color),
            0 8px 10px -6px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
            var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    }
    header {
        --tw-bg-opacity: 1;
        background-color: rgb(17 24 39 / var(--tw-bg-opacity));
        padding: 0.75rem;
        padding-left: 1.25rem;
        padding-right: 1.25rem;
        font-size: 1.125rem;
        line-height: 1.75rem;
        --tw-text-opacity: 1;
        color: rgb(255 255 255 / var(--tw-text-opacity));
        --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
            0 4px 6px -4px rgb(0 0 0 / 0.1);
        --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
            0 4px 6px -4px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
            var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    }
    dialog button {
        position: absolute;
        right: 0.625rem;
        top: 0.625rem;
        display: flex;
        height: 2rem;
        width: 2rem;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem;
        border-width: 0px;
        background-color: transparent;
        font-size: 1.25rem;
        line-height: 1.75rem;
        --tw-text-opacity: 1;
        color: rgb(255 255 255 / var(--tw-text-opacity));
        opacity: 0.75;
    }
    dialog button:hover {
        background-color: rgb(255 255 255 / 0.1);
        opacity: 1;
    }
    table {
        border-collapse: collapse;
        width: 100%;
        --tw-text-opacity: 1;
        color: rgb(38 38 38 / var(--tw-text-opacity));
    }
    th,
    td {
        white-space: nowrap;
        padding: 1rem;
        border: solid 1px #e5e7eb;
    }
    th {
        text-align: center;
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
