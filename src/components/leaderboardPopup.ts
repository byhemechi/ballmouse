import ms from 'ms'
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
    @property --property-name {
        syntax: '<length>';
        inherits: false;
        initial-value: #c0ffee;
    }

    @keyframes appear {
        from {
            opacity: 0;
            transform: scale(0.75);
        }
    }

    * {
        box-sizing: border-box;
    }
    body {
        background: #235169;
    }
    dialog {
        overflow: hidden;
        border-radius: 0.75rem;
        border-width: 0px;
        width: 100%;
        flex-direction: column;
        max-width: 56rem;
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
    @media all and (min-height: 40rem) {
        dialog {
            min-height: 32rem;
        }
    }
    dialog:modal {
        display: flex;
        box-shadow: var(--tw-shadow), 0 0 0 100vmax rgba(0, 0, 0, 0.5);
    }
    dialog.delay:modal {
        animation: appear 0.5s ease backwards;
        animation-delay: 1s;
    }
    ::backdrop {
        opacity: 0;
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
        transition: opacity 0.25s ease;
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
    button:disabled {
        opacity: 0.25 !important;
    }
    table {
        border-collapse: collapse;
        width: 100%;
        --tw-text-opacity: 1;
        color: rgb(38 38 38 / var(--tw-text-opacity));
    }
    th,
    td {
        height: 3rem;
        white-space: nowrap;
        padding-left: 1rem;
        padding-right: 1rem;
        border: solid 1px #e5e7eb;
    }
    th {
        height: 3rem !important;
        --tw-border-opacity: 1 !important;
        border-color: rgb(55 65 81 / var(--tw-border-opacity)) !important;
        --tw-bg-opacity: 1;
        background-color: rgb(17 24 39 / var(--tw-bg-opacity));
        padding-top: 0px !important;
        padding-bottom: 0px !important;
        --tw-text-opacity: 1;
        color: rgb(255 255 255 / var(--tw-text-opacity));
        text-align: left;
    }
`

export default class LeaderboardPopup extends HTMLElement {
    // table = new document.

    game: Game
    popup: HTMLDialogElement
    closeButton: HTMLButtonElement

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' })
        const showButton = document.createElement('button')

        shadow.appendChild(styles)

        showButton.textContent = 'High scores'
        shadow.appendChild(showButton)
        showButton.addEventListener('click', () => this.show(false))

        this.popup = document.createElement('dialog')
        const popup = this.popup

        shadow.appendChild(popup)

        popup.addEventListener('close', e => {
            this.game.acceptInput = true
        })
        const popupBody = popupTemplate.content.cloneNode(true)
        popup.prepend(popupBody)

        const closeButton = popup.querySelector('button')
        this.closeButton = closeButton

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
                el.children[3].textContent =
                    ms(Date.now() - score.getTimestamp()) + ' ago'
            }

            tbody.appendChild(row)
        }
    }

    public async show(delay = true) {
        this.game.acceptInput = false
        this.closeButton.disabled = true
        if (delay) this.popup.classList.add('delay')
        this.popup.addEventListener('animationend', () => {
            this.closeButton.disabled = false
            this.popup.classList.remove('delay')
        })
        this.popup.showModal()

        this.reloadScores()
    }

    hide() {
        this.popup.close()
    }
}
