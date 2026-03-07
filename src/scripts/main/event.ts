import { canvas, buttons, overlay } from "./reference";
import { MOUSE, WORLD, MODE, HISTORY, CIRCUIT, SETTINGS, DEVICE } from "./setup";
import { toWorld, isHovering, isHoveringPin, getPin } from "./util";
import {
    closeDialog,
    openExtraDevices,
    reRenderDeviceBar,
    zoomIN, zoomOUT,
    changeMode,
    snapToGrid,
    renderSnapToGridBtn,
    renderShowLabelBtn,
    handleModeButtonSelection,
    handlePinSelection
} from "./script";
import { saveSettings, setSetting } from "../../settings";
import { toggleSource } from "../devices/source";
import { toggleSwitch } from "../devices/switch";

canvas.addEventListener('contextmenu', (e) => { e.preventDefault() });

//========================= MOUSE ========================//

canvas.addEventListener('mousedown', (e) => {
    MOUSE.x = toWorld(e.offsetX, e.offsetY).x;
    MOUSE.y = toWorld(e.offsetX, e.offsetY).y;

    if (e.button === 0) MOUSE.isClicking.left = true;
    if (e.button === 2) MOUSE.isClicking.right = true;

    // left click + pan --> move canvas
    if (e.button === 0 && WORLD.mode === MODE.PAN) {
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

    // left click + edit --> select device or pin
    else if (e.button === 0 && WORLD.mode === MODE.EDIT) {
        
        let pinHovered = false;
        
        // check if hovering over any pin
        for (const [, device] of CIRCUIT.devices) {
            for (const pinId of device.inputPins) {
                if (isHoveringPin(getPin(pinId))) {
                    pinHovered = true;
                    break;
                }
            }
            for (const pinId of device.outputPins) {
                if (isHoveringPin(getPin(pinId))) {
                    pinHovered = true;
                    break;
                }
            }
            for (const pinId of device.in_outPins) {
                if (isHoveringPin(getPin(pinId))) {
                    pinHovered = true;
                    break;
                }
            }
            if (pinHovered) break;
        }
        
        if (pinHovered) {
            // Handle pin selection for all devices
            for (const [, device] of CIRCUIT.devices) {
                handlePinSelection(device.inputPins);
                handlePinSelection(device.outputPins);
                handlePinSelection(device.in_outPins);
            }
        } else {
            // Handle device selection only if no pin is hovered
            for (const [, device] of CIRCUIT.devices) {
                if (isHovering(device)) {
                    device.selected = !device.selected;
                    break;
                }
            }
        }
    }
        
    // left click + simulate --> interact with devices
    else if (e.button === 0 && WORLD.mode === MODE.SIMULATE) {
        
        for (const [, device] of CIRCUIT.devices) {
            if (isHovering(device)) {
                switch (device.name) {
                    case DEVICE.SOURCE:
                        toggleSource(device);
                        break;
                    case DEVICE.SWITCH:
                        toggleSwitch(device as any);
                        break;
                }
            }
        }
    }    
 
    else if (e.button === 2) {
        // TODO: right click features needed
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
        if(SETTINGS.snapToGrid) snapToGrid();
        HISTORY.save(CIRCUIT);
        // TODO: render undo-redo button here
    }
    WORLD.movingDevice = null;
});
canvas.addEventListener('mouseleave', () => {
    MOUSE.isClicking.left = false;
    MOUSE.isClicking.right = false;
    if (WORLD.mode === MODE.PAN) canvas.style.cursor = "grab";

    // disable dragging and panning effect on mouse leave
    WORLD.camera.isDragging = false;
    if (WORLD.movingDevice) {
        WORLD.movingDevice.isDragging = false;
        if(SETTINGS.snapToGrid) snapToGrid();
        HISTORY.save(CIRCUIT);
        // TODO: render undo-redo button here
    }
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
    handleModeButtonSelection(MODE.PAN);
});
buttons.edit.addEventListener('click', () => {
    handleModeButtonSelection(MODE.EDIT);
});
buttons.simulate.addEventListener('click', () => {
    handleModeButtonSelection(MODE.SIMULATE);
});
buttons.zoomIn.addEventListener('click', zoomIN);
buttons.zoomOut.addEventListener('click', zoomOUT);
buttons.snapToGrid.addEventListener('click', () => {
    SETTINGS.snapToGrid = !SETTINGS.snapToGrid;
    renderSnapToGridBtn();
    if (SETTINGS.snapToGrid) snapToGrid();
    setSetting("snapToGrid", SETTINGS.snapToGrid);
    saveSettings(SETTINGS);
});
buttons.showLabel.addEventListener('click', () => {
    SETTINGS.showLabel = !SETTINGS.showLabel;
    renderShowLabelBtn();
    setSetting("showLabel", SETTINGS.snapToGrid);
    saveSettings(SETTINGS);
});

//========================= WINDOW & DIALOG ========================//

overlay.addEventListener('click', closeDialog);
document.querySelector('.extra-device-toggle-button')?.addEventListener('click', openExtraDevices);
window.addEventListener('keydown', (e) => {

    if (!e.ctrlKey && !e.shiftKey) {
        switch (e.key) {
            case "Escape":
                if (WORLD.dialog.show) closeDialog();
                break;
            case "P":
            case "p":
                handleModeButtonSelection(MODE.PAN);
                break;
            case "e":
            case "E":
                handleModeButtonSelection(MODE.EDIT);
                break;
            case "s":
            case "S":
                handleModeButtonSelection(MODE.SIMULATE);
                break;
        }
    }

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

//========================= DEBUG ========================//

window.addEventListener('keydown', (e) => {
    if (!(e.ctrlKey && e.key === "/")) return;

    console.log(CIRCUIT.nets);
});

window.addEventListener('keydown', (e) => {
    if (!(e.ctrlKey && e.key === "1")) return;

    console.log(HISTORY);
});