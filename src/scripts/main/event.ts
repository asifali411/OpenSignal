canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

//========================= MOUSE ========================//

canvas.addEventListener('mousedown', (e) => {
    MOUSE.x = toWorld(e.offsetX, e.offsetY).x;
    MOUSE.y = toWorld(e.offsetX, e.offsetY).y;

    if(e.button === 0 && WORLD.mode === MODE.PAN){
        MOUSE.isClicking.left = true;
        let isMovingCamera = true;

        CIRCUIT.devices.forEach((device: any) => {
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
        } else {
            if (WORLD.movingDevice != null) {
                WORLD.movingDevice.isDragging = true;
                WORLD.movingDevice.offsetX = MOUSE.x - WORLD.movingDevice.x;
                WORLD.movingDevice.offsetY = MOUSE.y - WORLD.movingDevice.y;
            }
        }
    }

    else if (e.button === 2) {
        MOUSE.isClicking.right = true;
        CIRCUIT.devices.forEach((device: any) => {
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
    if (WORLD.mode === MODE.PAN) canvas.style.cursor = "grab";
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
    if (WORLD.mode === MODE.PAN) canvas.style.cursor = "grab";
    WORLD.camera.isDragging = false;
    if (WORLD.movingDevice) WORLD.movingDevice.isDragging = false;
    WORLD.movingDevice = null;
});
canvas.addEventListener('mousemove', (e) => {
    MOUSE.x = toWorld(e.offsetX, e.offsetY).x;
    MOUSE.y = toWorld(e.offsetX, e.offsetY).y;

    if (WORLD.mode === MODE.PAN && MOUSE.isClicking.left) {
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

//========================= BUTTONS ========================//

BUTTONS.undo.addEventListener('click', () => {
    HISTORY.undo();
});
BUTTONS.redo.addEventListener('click', () => {
    HISTORY.redo();
});
BUTTONS.pan.addEventListener('click', () => {
    WORLD.mode = MODE.PAN;
    canvas.style.cursor = 'grab';
});
BUTTONS.edit.addEventListener('click', () => {
    WORLD.mode = MODE.EDIT;
    canvas.style.cursor = 'pointer';
});

//========================= WINDOW & DIALOG ========================//

overlay.addEventListener('click', closeDialog);
document.querySelector('.extra-device-toggle-button')!.addEventListener('click', openExtraDevices);
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
            if (e.ctrlKey) HISTORY.redo();
            break;
        case ",":
        case ".":
        case "ArrowLeft":
        case "ArrowRight":
            if (e.ctrlKey) changeMode();
            break;
    }
});
window.addEventListener('resize', () => {
    reRenderDeviceBar();
});

//========================= DEBUG   Ctrl + "/" ========================//
window.addEventListener('keydown', (e) => {
    if(e.ctrlKey && e.key === "/"){
        //DEBUG
        // console.debug(HISTORY);
        console.debug(CIRCUIT);
    }
});