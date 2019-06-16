import loadGame from "./loadgame";

const container = document.querySelector("#menu");
async function generateMenu() {
    const menufetch = fetch("/menu.json");
    const menu = await menufetch;
    const data = await menu.json();
    
    container.innerHTML = "";
    container.style = {}

    const menuHeader = document.createElement("h1");
    menuHeader.textContent = data.title;
    container.appendChild(menuHeader);
    document.title = data.title;
    
    data.games.forEach(game => {
        const newel = document.createElement("button");

        newel.onclick = ( e ) => {
            createGameMenu(game); // Delete the menu
        }

        newel.innerHTML = game.title;

        container.appendChild(newel)
    });
}

window.onload = generateMenu;

function createGameMenu(game) {
    container.innerHTML = "";

    container.style.background = game.background;

    // Game Icon
    const icon = new Image();
    icon.src = game.icon;
    container.appendChild(icon);
    
    // Game title
    const title = document.createElement("h1");
    title.textContent = game.title;
    container.appendChild(title);
    
    // Play button
    const play = document.createElement("button");
    play.textContent = "Play"
    play.onclick = ( e ) => {
        loadGame(game);
        container.parentElement.removeChild(container);
    }
    container.appendChild(play);

    // Back button
    const back = document.createElement("button");
    back.textContent = "Back";
    back.className = "back";
    back.onclick = generateMenu;
    container.appendChild(back);
}
