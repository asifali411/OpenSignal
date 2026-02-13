createDeviceBar();
createExtraDeviceDialog();
renderUndoRedoBtn();

const update = () => {
    resizeCanvas();
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#FFFAFA";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.scale(WORLD.camera.zoom, WORLD.camera.zoom);
    ctx.translate(-WORLD.camera.x, -WORLD.camera.y);

    createGrid();

    // render components
    drawDEVICES();

    ctx.restore();
    requestAnimationFrame(update);
}

update();

document.querySelector('.zoom-in').addEventListener('click', zoomIN);
document.querySelector('.zoom-out').addEventListener('click', zoomOUT);