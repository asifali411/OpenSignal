import { canvas, buttons, overlay } from "./reference";
import { MOUSE, WORLD, MODE, HISTORY, CIRCUIT } from "./setup";
import { toWorld, isHovering } from "./util";
import {
    closeDialog,
    openExtraDevices,
    reRenderDeviceBar,
    zoomIN, zoomOUT,
    renderModeBtn,
    changeMode
} from "./script";

canvas.addEventListener('contextmenu', (e) => { e.preventDefault() });

//========================= MOUSE ========================//

canvas.addEventListener('mousedown', (e) => {
    MOUSE.x = toWorld(e.offsetX, e.offsetY).x;
    MOUSE.y = toWorld(e.offsetX, e.offsetY).y;

    // left click + pan --> move canvas
    if (e.button === 0 && WORLD.mode === MODE.PAN) {
        MOUSE.isClicking.left = true;
        let isMovingCamera = true;

        // if is hovering over device --> move device instead
        CIRCUIT.devices.forEach((device: any) => {
            if (isHovering(device)) {
                isMovingCamera = false;
                WORLD.movingDevice = device;
            }
        });

        canvas.style.cursor = "grabbing";
        
        if (isMovingCamera) {
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

    // left click + edit --> select device
    else if (e.button === 0 && WORLD.mode === MODE.EDIT) {
        CIRCUIT.devices.forEach((device: any) => {
            if (isHovering(device)) {
                device.selected = !device.selected;
            }
        });
    }

    // if right click --> interact with devices
    // this is meant to be a shortcut way to handle simulation mode without actually toggling to simulation mode
    // however this logic needs to be discussed later  
    else if (e.button === 2) {
        MOUSE.isClicking.right = true;
        CIRCUIT.devices.forEach((device: any) => {
            if (isHovering(device)) {
                switch (device.name) {
                    case "Source":
                        // TODO: handle toggle source here
                        break;
                }
            }
        });
    }
});
canvas.addEventListener('mouseup', () => {
    MOUSE.isClicking.left = false;
    MOUSE.isClicking.right = false;
    if (WORLD.mode === MODE.PAN) canvas.style.cursor = "grab";

    // disable dragging and panning effect on mouse up
    WORLD.camera.isDragging = false;
    if (WORLD.movingDevice) {
        WORLD.movingDevice.isDragging = false;
        HISTORY.save(CIRCUIT);
        // TODO: render undo-redo button here
    }
    WORLD.movingDevice = null;
});
canvas.addEventListener('mouseleave', () => {
    MOUSE.isClicking.left = false;
    MOUSE.isClicking.right = false;

    // disable dragging and panning effect on mouse leave
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

buttons.undo.addEventListener('click', () => {
    Object.assign(CIRCUIT, HISTORY.undo());
});
buttons.redo.addEventListener('click', () => {
    Object.assign(CIRCUIT, HISTORY.redo());
});
buttons.pan.addEventListener('click', () => {
    WORLD.mode = MODE.PAN;
    canvas.style.cursor = 'grab';
    renderModeBtn();
});
buttons.edit.addEventListener('click', () => {
    WORLD.mode = MODE.EDIT;
    canvas.style.cursor = 'pointer';
    renderModeBtn();
});
buttons.simulate.addEventListener('click', () => {
    WORLD.mode = MODE.SIMULATE;
    canvas.style.cursor = 'pointer';
    renderModeBtn();
});
buttons.zoomIn.addEventListener('click', zoomIN);
buttons.zoomOut.addEventListener('click', zoomOUT);

//========================= WINDOW & DIALOG ========================//

overlay.addEventListener('click', closeDialog);
document.querySelector('.extra-device-toggle-button')?.addEventListener('click', openExtraDevices);
window.addEventListener('keydown', (e) => {

    if (e.key === "Escape") {
        if (WORLD.dialog.show) closeDialog();
    }

    if (e.ctrlKey) {
        switch (e.key) {
            case "-":
                zoomOUT();
                break;
            case "=":
                zoomIN();
                break;
            
            case "z":
            case "Z":
                Object.assign(CIRCUIT, HISTORY.undo());
                break;
            case "y":
            case "Y":
                Object.assign(CIRCUIT, HISTORY.redo());
                break;
            
            case ",":
            case "ArrowLeft":
                changeMode(-1);
                break;
            case ".":
            case "ArrowRight":
                changeMode(1);
                break;
        }
    }
});
window.addEventListener('resize', () => {
    reRenderDeviceBar();
});