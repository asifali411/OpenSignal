canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
canvas.addEventListener('mousedown', (e) => {
    MOUSE.x = toWorld(e.offsetX, e.offsetY).x;
    MOUSE.y = toWorld(e.offsetX, e.offsetY).y;

    if(e.button === 0 && WORLD.mode === PAN){
        MOUSE.isClicking.left = true;
        let isMovingCamera = true;

        CIRCUIT.devices.forEach(device => {
            if(isHovering(device)){
                isMovingCamera = false;
                WORLD.movingDevice = device;
            }
        });

        canvas.style.cursor = "grabbing";
        
        if(isMovingCamera){
            WORLD.camera.lastX = e.offsetX;
            WORLD.camera.lastY = e.offsetY;
            WORLD.camera.isDragging = true;
        }else{
            WORLD.movingDevice.isDragging = true;
            WORLD.movingDevice.offsetX = MOUSE.x - WORLD.movingDevice.x;
            WORLD.movingDevice.offsetY = MOUSE.y - WORLD.movingDevice.y;
        }
    }

    else if (e.button === 2) {
        MOUSE.isClicking.right = true;
        CIRCUIT.devices.forEach(device => {
            if(isHovering(device)){
                if (device.name === "Source") {
                    toggleSOURCE(device);
                }
            }
        });
    }
});
canvas.addEventListener('mouseup', () => {
    MOUSE.isClicking.left = false;
    MOUSE.isClicking.right = false;
    if (WORLD.mode === PAN) canvas.style.cursor = "grab";
    WORLD.camera.isDragging = false;
    if (WORLD.movingDevice) {
        WORLD.movingDevice.isDragging = false;
        HISTORY.saveState();
    }
    WORLD.movingDevice = null;
});
canvas.addEventListener('mouseleave', () => {
    MOUSE.isClicking.left = false;
    MOUSE.isClicking.right = false;
    if (WORLD.mode === PAN) canvas.style.cursor = "grab";
    WORLD.camera.isDragging = false;
    if (WORLD.movingDevice) WORLD.movingDevice.isDragging = false;
    WORLD.movingDevice = null;
});
canvas.addEventListener('mousemove', (e) => {
    MOUSE.x = toWorld(e.offsetX, e.offsetY).x;
    MOUSE.y = toWorld(e.offsetX, e.offsetY).y;

    if (WORLD.mode === PAN && MOUSE.isClicking.left) {
        if (WORLD.movingDevice == null) {
            const dx = (e.offsetX - WORLD.camera.lastX) / WORLD.camera.zoom;
            const dy = (e.offsetY - WORLD.camera.lastY) / WORLD.camera.zoom;
            WORLD.camera.x -= dx;
            WORLD.camera.y -= dy;
            WORLD.camera.lastX = e.offsetX;
            WORLD.camera.lastY = e.offsetY;
        } else {
            WORLD.movingDevice.x = MOUSE.x - WORLD.movingDevice.offsetX;
            WORLD.movingDevice.y = MOUSE.y - WORLD.movingDevice.offsetY;
        }
    }
});
window.addEventListener('keydown', (e) => {

    switch (e.key) {
        case "_":
            zoomOUT();
            break;
        case "+":
            zoomIN();
            break;
        case "Escape":
            if (WORLD.dialog.show) closeDialog();
            break;
        case "z":
            if (e.ctrlKey) HISTORY.undo();
            break;
        case "y":
            if (e.ctrlKey) HISTORY.undo();
            break;
        case ",":
        case ".":
        case "ArrowLeft":
        case "ArrowRight":
            if (e.ctrlKey) changeMode();
            break;
    }
});
overlay.addEventListener('click', closeDialog);

document.querySelector('.extra-device-toggle-button').addEventListener('click', openExtraDevices);

BUTTONS.undo.addEventListener('click', () => {
    HISTORY.undo();
});
BUTTONS.redo.addEventListener('click', () => {
    HISTORY.redo();
});
window.addEventListener('resize', () => {
    reRenderDeviceBar();
});

BUTTONS.pan.addEventListener('click', () => {
    WORLD.mode = PAN;
    canvas.style.cursor = 'grab';
});
BUTTONS.edit.addEventListener('click', () => {
    WORLD.mode = EDIT;
    canvas.style.cursor = 'pointer';
});

//DEBUG   Ctrl + '/'
window.addEventListener('keydown', (e) => {
    if(e.ctrlKey && e.key === "/"){
        //DEBUG
        console.log(HISTORY);
        console.log(CIRCUIT);
    }
});