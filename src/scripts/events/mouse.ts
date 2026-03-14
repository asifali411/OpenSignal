import { canvas } from "../main/reference";
import { MOUSE, WORLD, MODE, CIRCUIT, SETTINGS, DEVICE, HISTORY } from "../main/setup";
import { toWorld, isHovering, isHoveringPin, getPin } from "../main/util";
import { snapToGrid, handlePinSelection } from "../main/script";
import { toggleSource } from "../devices/source";
import { Switch, toggleSwitch } from "../devices/switch";

export const registerMouseEvents = () => {
    canvas.addEventListener("contextmenu", (e: MouseEvent) => {e.preventDefault()});
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseEnd);
    canvas.addEventListener("mouseleave", handleMouseEnd);
    canvas.addEventListener("mousemove", handleMouseMove);
}

const threshold = 5;

const handleMouseDown = (e: MouseEvent) => {

    MOUSE.x = toWorld(e.offsetX, e.offsetY).x;
    MOUSE.y = toWorld(e.offsetX, e.offsetY).y;

    MOUSE.lastX = MOUSE.x;
    MOUSE.lastY = MOUSE.y;

    //left click
    if(e.button === 0){
        MOUSE.isClicking.left = true;

        for(const [, device] of CIRCUIT.devices){
            if(isHovering(device)){

                if(WORLD.mode === MODE.SIMULATE){

                    switch(device.name){
                        case DEVICE.SOURCE:
                            toggleSource(device);
                            break;
                        case DEVICE.SWITCH:
                            toggleSwitch(device as Switch);
                            break;
                    }

                    break;
                }

                canvas.style.cursor = "move";
                WORLD.movingDevice = device;
                WORLD.movingDevice.isDragging = true;
                WORLD.movingDevice.offsetX = MOUSE.x - WORLD.movingDevice.x;
                WORLD.movingDevice.offsetY = MOUSE.y - WORLD.movingDevice.y;
                break;
            }
        }
    }

    //right click
    if(e.button === 2){
        MOUSE.isClicking.right = true;

        MOUSE.isClicking.right = true;
        canvas.style.cursor = "move";
        WORLD.camera.lastX = e.offsetX;
        WORLD.camera.lastY = e.offsetY;
        WORLD.camera.isDragging = true;
    }
}

//=========================================================================//

const handleLeftClick = () => {

    if(WORLD.mode !== MODE.EDIT) return;

    let pinHovered = false;

    // check if hovering over any pin
    outer: for (const [, device] of CIRCUIT.devices) {
        for (const pinId of [...device.inputPins, ...device.outputPins, ...device.in_outPins]) {
            if (isHoveringPin(getPin(pinId))) {
                pinHovered = true;
                break outer;
            }
        }
    }

    if (pinHovered) {
        for (const [, device] of CIRCUIT.devices) {
            handlePinSelection(device.inputPins);
            handlePinSelection(device.outputPins);
            handlePinSelection(device.in_outPins);
        }
    } else {
        // select device only if no pin is hovered
        for (const [, device] of CIRCUIT.devices) {
            if (isHovering(device)) {
                device.selected = !device.selected;
                break;
            }
        }
    }
}

const handleRightClick = () => {
    for(const [, device] of CIRCUIT.devices){
        if(isHovering(device)){
            // TODO: handle right click dialogue
            break;
        }
    }
}

//=========================================================================//

const handleMouseMove = (e: MouseEvent) => {
    MOUSE.x = toWorld(e.offsetX, e.offsetY).x;
    MOUSE.y = toWorld(e.offsetX, e.offsetY).y;

    if(WORLD.movingDevice != null){
        WORLD.movingDevice.x = MOUSE.x - WORLD.movingDevice.offsetX;
        WORLD.movingDevice.y = MOUSE.y - WORLD.movingDevice.offsetY;
    }

    if(MOUSE.isClicking.right){
        const dx = (e.offsetX - WORLD.camera.lastX) / WORLD.camera.zoom;
        const dy = (e.offsetY - WORLD.camera.lastY) / WORLD.camera.zoom;
        WORLD.camera.x -= dx;
        WORLD.camera.y -= dy;
        WORLD.camera.lastX = e.offsetX;
        WORLD.camera.lastY = e.offsetY;
    }
}

const handleMouseEnd = () => {

    const dx = MOUSE.x - MOUSE.lastX;
    const dy = MOUSE.y - MOUSE.lastY;

    if(Math.hypot(dx, dy) <= threshold){
        if(MOUSE.isClicking.left){
            handleLeftClick();
        }
        if(MOUSE.isClicking.right){
            handleRightClick();
        }
    }

    if(WORLD.mode === MODE.EDIT) canvas.style.cursor = "default";
    else canvas.style.cursor = "pointer";

    MOUSE.isClicking.left = false;
    MOUSE.isClicking.right = false;
    WORLD.camera.isDragging = false;

    if(WORLD.movingDevice != null){
        WORLD.movingDevice.isDragging = false;
        if (SETTINGS.snapToGrid) snapToGrid();
        HISTORY.save(CIRCUIT);
    }
    WORLD.movingDevice = null;
}