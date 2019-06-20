document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('pre code').forEach((block) => {
        if(block.classList.contains("mermaid")) {
            const oh = block.innerHTML;
            const el = block.parentElement;
            el.outerHTML = `<div class=\"mermaid\">${oh}</div>`;
            // console.log(el)
        } else hljs.highlightBlock(block);
    });
});