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
    for(let i = 0; i < TOOLS.length; i++){
        toolBar.innerHTML += `
            <div class="tool" title="${TOOLS[i].tool}" idx="${i + 1}">
            <img src="${TOOLS[i].img}">
            </div>
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