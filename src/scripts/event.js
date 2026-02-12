canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
canvas.addEventListener('mousedown', (e) => {
    MOUSE.x = toWorld(e.offsetX, e.offsetY).x;
    MOUSE.y = toWorld(e.offsetX, e.offsetY).y;

    if(e.button === 0){

        let isMovingCamera = true;

        CIRCUIT.devices.forEach(device => {
            if(device.isHovering()){
                isMovingCamera = false;
                WORLD.movingDevice = device;
                WORLD.mode = MOVE;
            }
        });

        canvas.style.cursor = "grabbing";
        
        if(isMovingCamera){
            WORLD.mode = PAN;
            WORLD.camera.lastX = e.offsetX;
            WORLD.camera.lastY = e.offsetY;
            WORLD.camera.isDragging = true;
        }else{
            WORLD.movingDevice.isDragging = true;
            WORLD.movingDevice.offsetX = MOUSE.x - WORLD.movingDevice.x;
            WORLD.movingDevice.offsetY = MOUSE.y - WORLD.movingDevice.y;
        }
    }
});
canvas.addEventListener('mouseup', () => {
    WORLD.mode = EDIT;
    canvas.style.cursor = "grab";
    WORLD.camera.isDragging = false;
    if (WORLD.movingDevice) WORLD.movingDevice.isDragging = false;
    WORLD.movingDevice = null;
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
    } else if (WORLD.mode === MOVE){
        WORLD.movingDevice.x = MOUSE.x - WORLD.movingDevice.offsetX;
        WORLD.movingDevice.y = MOUSE.y - WORLD.movingDevice.offsetY;
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
});

//DEBUG   Ctrl + '/'
window.addEventListener('keydown', (e) => {
    if(e.ctrlKey && e.key === "/"){
        console.log("working");
    }
});