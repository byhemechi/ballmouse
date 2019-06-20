document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('pre').forEach((block) => {
        if(block.textContent.match(/^mermaid/)) {
            const oh = block.textContent;
            const el = block.parentElement;
            el.outerHTML = `<div class=\"mermaid\">${oh.replace(/^mermaid ?/, "")}</div>`;
        } 
    });
});