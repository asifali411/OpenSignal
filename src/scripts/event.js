canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

canvas.addEventListener('mousedown', (e) => {
    MOUSE.x = toWorld(e.offsetX, e.offsetY).x;
    MOUSE.y = toWorld(e.offsetX, e.offsetY).y;

    if(e.button === 2){
        canvas.style.cursor = "grabbing";
        WORLD.mode = PAN;
        WORLD.camera.lastX = e.offsetX;
        WORLD.camera.lastY = e.offsetY;
    }
});
canvas.addEventListener('mouseup', () => {
    WORLD.mode = EDIT;
    canvas.style.cursor = "grab";
});
canvas.addEventListener('mousemove', (e) => {
    MOUSE.x = toWorld(e.offsetX, e.offsetY).x;
    MOUSE.y = toWorld(e.offsetX, e.offsetY).y;

    if(WORLD.mode === PAN){
        const dx = (e.offsetX - WORLD.camera.lastX) / WORLD.camera.zoom;
        const dy = (e.offsetY - WORLD.camera.lastY) / WORLD.camera.zoom;
        WORLD.camera.x -= dx;
        WORLD.camera.y -= dy;
        WORLD.camera.lastX = e.offsetX;
        WORLD.camera.lastY = e.offsetY;
    }
});
window.addEventListener('keydown', (e) => {
    if (e.key === "_" ) zoomOUT();
    else if (e.key === "+") zoomIN();
    else if (e.key === "Escape") {
        if(WORLD.dialog.show){
            closeDialog();
        }
    }
});
overlay.addEventListener('click', closeDialog);
document.querySelector('.extra-device-toggle-button').addEventListener('click', openExtraDevices);
window.addEventListener('resize', () => {
    reRenderDeviceBar();
})