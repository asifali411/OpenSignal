import { canvas } from "../main/reference";
import { MOUSE, WORLD, MODE, CIRCUIT, SETTINGS, DEVICE, HISTORY, deviceSize, gridSize } from "../main/setup";
import { toWorld, isHovering, isHoveringPin, getPin, toScreen, getDevice } from "../main/util";
import { snapToGrid, handlePinSelection, openContextDialog, removeDeviceFromGrid, addDeviceToGrid, getDevicesFromGrid } from "../main/script";
import { toggleSource } from "../devices/source";
import { Switch, toggleSwitch } from "../devices/switch";

export const registerMouseEvents = () => {
    canvas.addEventListener("contextmenu", (e: MouseEvent) => { e.preventDefault() });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseEnd);
    canvas.addEventListener("mouseleave", handleMouseEnd);
    canvas.addEventListener("mousemove", handleMouseMove);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getAllDevicesAdjacentTo = (x: number, y: number): number[] => {
    const delta = [
        [-1, -1], [0, -1], [1, -1],
        [-1,  0], [0,  0], [1,  0],
        [-1,  1], [0,  1], [1,  1]
    ];

    const neighbours = new Set<number>();

    for (const [dx, dy] of delta) {
        const key = `${Math.floor(x / gridSize) + dx}-${Math.floor(y / gridSize) + dy}`;
        for (const id of getDevicesFromGrid(key)) {
            neighbours.add(id);
        }
    }

    return [...neighbours];
}

const getHoveredPin = (x: number, y: number) => {
    for (const deviceID of getAllDevicesAdjacentTo(x, y)) {
        const device = getDevice(deviceID);
        for (const pinId of [...device.inputPins, ...device.outputPins, ...device.in_outPins]) {
            const pin = getPin(pinId);
            if (isHoveringPin(pin)) return pin;
        }
    }
    return null;
}

const DRAG_THRESHOLD = 5;

// ─── Mouse Down ───────────────────────────────────────────────────────────────

const handleMouseDown = (e: MouseEvent) => {
    
    const { x, y } = toWorld(e.offsetX, e.offsetY);
    MOUSE.x = x;
    MOUSE.y = y;
    MOUSE.lastX = x;
    MOUSE.lastY = y;

    // Left click
    if (e.button === 0) {
        MOUSE.isClicking.left = true;

        for (const deviceID of getAllDevicesAdjacentTo(MOUSE.x, MOUSE.y)) {
            const device = getDevice(deviceID);

            if (isHovering(device)) {

                if (WORLD.mode === MODE.SIMULATE) {
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
                removeDeviceFromGrid(WORLD.movingDevice);
                break;
            }
        }
    }

    // Right click
    if (e.button === 2) {
        MOUSE.isClicking.right = true;
        canvas.style.cursor = "move";
        WORLD.camera.lastX = e.offsetX;
        WORLD.camera.lastY = e.offsetY;
        WORLD.camera.isDragging = true;
    }
}

// ─── Click Handlers ───────────────────────────────────────────────────────────

const handleLeftClick = (x: number, y: number) => {
    if (WORLD.mode !== MODE.EDIT) return;

    const hoveredPin = getHoveredPin(x, y);

    if (hoveredPin) {
        for (const [, device] of CIRCUIT.devices) {
            handlePinSelection(device.inputPins);
            handlePinSelection(device.outputPins);
            handlePinSelection(device.in_outPins);
        }
    } else {
        let isDeviceSelected = false;

        for (const deviceID of getAllDevicesAdjacentTo(x, y)) {
            const device = getDevice(deviceID);
            if (isHovering(device)) {
                device.selected = !device.selected;
                isDeviceSelected = true;
                break;
            }
        }

        if (!isDeviceSelected) {
            for (const [, device] of CIRCUIT.devices) {
                device.selected = false;
            }
        }
    }
}

const handleRightClick = (x: number, y: number) => {
    for (const [, device] of CIRCUIT.devices) {
        device.selected = false;
    }

    for (const deviceID of getAllDevicesAdjacentTo(x, y)) {
        const device = getDevice(deviceID);
        if (isHovering(device)) {
            device.selected = true;
            openContextDialog(toScreen(device.x + deviceSize, device.y + deviceSize));
            break;
        }
    }
}

// ─── Mouse Move ───────────────────────────────────────────────────────────────

const handleMouseMove = (e: MouseEvent) => {
    const { x, y } = toWorld(e.offsetX, e.offsetY);
    MOUSE.x = x;
    MOUSE.y = y;

    if (WORLD.movingDevice != null) {
        WORLD.movingDevice.x = MOUSE.x - WORLD.movingDevice.offsetX;
        WORLD.movingDevice.y = MOUSE.y - WORLD.movingDevice.offsetY;
    }

    if (MOUSE.isClicking.right) {
        const dx = (e.offsetX - WORLD.camera.lastX) / WORLD.camera.zoom;
        const dy = (e.offsetY - WORLD.camera.lastY) / WORLD.camera.zoom;
        WORLD.camera.x -= dx;
        WORLD.camera.y -= dy;
        WORLD.camera.lastX = e.offsetX;
        WORLD.camera.lastY = e.offsetY;
    }
}

// ─── Mouse End (mouseup + mouseleave) ─────────────────────────────────────────

const handleMouseEnd = () => {
    const dx = MOUSE.x - MOUSE.lastX;
    const dy = MOUSE.y - MOUSE.lastY;
    const isClick = Math.hypot(dx, dy) <= DRAG_THRESHOLD;

    if (isClick) {
        if (MOUSE.isClicking.left)  handleLeftClick(MOUSE.x, MOUSE.y);
        if (MOUSE.isClicking.right) handleRightClick(MOUSE.x, MOUSE.y);
    }

    if (MOUSE.isClicking.left && WORLD.mode === MODE.EDIT && !isClick) {
        const minX = Math.min(MOUSE.lastX, MOUSE.x);
        const maxX = Math.max(MOUSE.lastX, MOUSE.x);
        const minY = Math.min(MOUSE.lastY, MOUSE.y);
        const maxY = Math.max(MOUSE.lastY, MOUSE.y);

        for (const [, device] of CIRCUIT.devices) {
            device.selected = (
                device.x >= minX &&
                device.x <= maxX &&
                device.y >= minY &&
                device.y <= maxY
            );
        }
    }

    // Reset cursor
    if (WORLD.mode === MODE.EDIT) canvas.style.cursor = "default";
    else canvas.style.cursor = "pointer";

    MOUSE.isClicking.left = false;
    MOUSE.isClicking.right = false;
    WORLD.camera.isDragging = false;

    if (WORLD.movingDevice != null && WORLD.mode === MODE.EDIT) {
        WORLD.movingDevice.isDragging = false;
        if (SETTINGS.snapToGrid) snapToGrid();
        addDeviceToGrid(WORLD.movingDevice);
        HISTORY.save(CIRCUIT);
    } else if (WORLD.movingDevice != null) {
        WORLD.movingDevice.isDragging = false;
        addDeviceToGrid(WORLD.movingDevice);
    }

    WORLD.movingDevice = null;
}