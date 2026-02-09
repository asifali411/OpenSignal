const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
const createGrid = () => {
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = '#444';

    for(let x = -canvas.width * 10; x < canvas.width * 10; x+=tileSize){
        ctx.moveTo(x, -canvas.height * 10);
        ctx.lineTo(x, canvas.height * 10);
    }
    for (let y = -canvas.height * 10; y < canvas.height * 10; y += tileSize) {
        ctx.moveTo(-canvas.width * 10, y);
        ctx.lineTo(canvas.width * 10, y);
    }

    ctx.stroke();
    ctx.globalAlpha = 1;
}
const createToolBar = () => {
    let i = 1;
    
    for(; i < Math.min(Math.floor(toolBar.getBoundingClientRect().width / 50), TOOLS.length); i++){
        toolBar.innerHTML += `
            <button class="tool" title="${TOOLS[i].tool}" idx="${i}">
                <img src="${TOOLS[i].img}">
            </button>
        `;
    }

    toolBar.innerHTML += `
        <button class="tool extra-tool-toggle-button" title="all components" idx="${++i}">
            <img src="../src/assets/ellipsis.svg">
        </button>
    `;
}
const reRenderToolBar = () => {
    const visibleTools = Array(...document.querySelectorAll(".tool-bar .tool"));
    visibleTools.splice(visibleTools.length - 1, 1);
    
    visibleTools.forEach(tool => {
        // remove event listener here.
        tool.remove();
    })
    
    for(let i = Math.min(Math.floor(toolBar.getBoundingClientRect().width / 60), TOOLS.length - 1); i > 0; i--){
        toolBar.innerHTML = `
            <button class="tool" title="${TOOLS[i].tool}" idx="${i}">
                <img src="${TOOLS[i].img}">
            </button>
        ` + toolBar.innerHTML;
    }
    document.querySelector('.extra-tool-toggle-button').addEventListener('click', openExtraTools);
}
const createExtraToolDialog = () => {
    for(let i = 0; i < TOOLS.length; i++){
        extraTools.innerHTML += `
            <button class="tool" title="${TOOLS[i].tool}" idx="${i}">
                <img src="${TOOLS[i].img}">
            </button>
        `;
    }
}
const toWorld = (x, y) => {
    return {
        x: (x - canvas.width/2) / WORLD.camera.zoom + WORLD.camera.x,
        y: (y - canvas.height/2) / WORLD.camera.zoom + WORLD.camera.y,
    }
}
const setZoomPercentage = () => {
    const percentage = Math.round(WORLD.camera.zoom * 100);
    document.querySelector('.zoom-percentage').textContent = `${percentage}%`;
}
const zoomIN = () => {
    if(WORLD.camera.zoom >= 4) return;
    WORLD.camera.zoom += 0.1;
    setZoomPercentage();
}
const zoomOUT = () => {
    if(WORLD.camera.zoom <= 0.2) return;
    WORLD.camera.zoom -= 0.1;
    setZoomPercentage();
}
const closeDialog = () => {
    WORLD.dialog.show = false;
    overlay.classList.add('hidden');
    switch(WORLD.dialog.box){
        case EXTRA_TOOLS:
            closeExtraTools();
            break;
        default:
            throw new Error(`Invalid dialog box: ${WORLD.dialog.box}`);
    }
}
const openExtraTools = () => {
    extraToolDialog.classList.remove('hidden');
    WORLD.dialog.show = true;
    overlay.classList.remove('hidden');
};
const closeExtraTools = () => extraToolDialog.classList.add('hidden');