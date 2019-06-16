/**
 * Loads a game from an entry file
 * @param {string} game Game object with title and entry
 */
export default async function loadGame(game) {
    const nscript = document.createElement("script");
    nscript.src = game.entry;
    document.title = game.title
    document.body.appendChild(nscript);
}