import { deviceBar, extraDevices, buttons, canvas, extraDeviceDialog, overlay } from "./reference";
import { DEVICES, WORLD, MODE, CIRCUIT, HISTORY, tileSize, SETTINGS, DEVICE, SOLVER } from "./setup";

import Draw from "../devices/functions/draw";
import Create from "../devices/functions/create";
import Device from "../devices/device";
import { getPin, getPinX, getPinY, isHoveringPin } from "./util";
import Pin from "../devices/functions/pin";
import { addToNet, combineNets, Net } from "../../solver/net";
import Gate from "../devices/gate";
import Update from "../devices/functions/update";

//========================= DEVICES ========================//

const DRAW = new Draw();
const CREATE = new Create();

const drawDevices = () => {
    CIRCUIT.devices.forEach((device: Device) => {
        if (!isOutOfCanvas(device)) {
            switch (device.name) {
                case DEVICE.SOURCE:
                    DRAW.source(device);
                    break;
                case DEVICE.BULB:
                    DRAW.bulb(device);
                    break;
                case DEVICE.SWITCH:
                    DRAW.keySwitch(device as any);
                    break;
                case DEVICE.AND:
                    DRAW.and(device);
                    break;
                case DEVICE.OR:
                    DRAW.or(device);
                    break;
                case DEVICE.NOT:
                    DRAW.not(device);
                    break;
                case DEVICE.XOR:
                    DRAW.xor(device);
                    break;
                case DEVICE.NAND:
                    DRAW.nand(device);
                    break;
                case DEVICE.NOR:
                    DRAW.nor(device);
                    break;
                case DEVICE.XNOR:
                    DRAW.xnor(device);
                    break;
            }
        }
    });
}

const updateDevice = (device: Gate | Device): number => {
    switch (device.name) {
        case DEVICE.AND:
            return Update.and(device);
        case DEVICE.OR:
            return Update.or(device);
        case DEVICE.NOT:
            return Update.not(device);
        case DEVICE.XOR:
            return Update.xor(device);
        case DEVICE.NAND:
            return Update.nand(device);
        case DEVICE.NOR:
            return Update.nor(device);
        case DEVICE.XNOR:
            return Update.xnor(device);
    }

    return -1;
}

//========================= DEVICE BAR ========================//

const handleDeviceElementClick = (deviceName: DEVICE): void => {
    switch (deviceName) {
        case DEVICE.SOURCE:
            CREATE.source();
            break;
        case DEVICE.BULB:
            CREATE.bulb();
            break;
        case DEVICE.SWITCH:
            CREATE.keySwitch();
            break;
        case DEVICE.AND:
            CREATE.and();
            break;
        case DEVICE.OR:
            CREATE.or();
            break;
        case DEVICE.NOT:
            CREATE.not();
            break;
        case DEVICE.XOR:
            CREATE.xor();
            break;
        case DEVICE.NAND:
            CREATE.nand();
            break;
        case DEVICE.NOR:
            CREATE.nor();
            break;
        case DEVICE.XNOR:
            CREATE.xnor();
            break;
        default:
            console.error(`Device name not recognized: ${deviceName}`);
            return;
    }

    if (SETTINGS.snapToGrid) snapToGrid();
    HISTORY.save(CIRCUIT);
}
const createDeviceBar = (): void => {
    const maxSize = Math.min(Math.floor(deviceBar.getBoundingClientRect().width / 60), DEVICES.length);
    
    // render all device buttons
    for (let i = 0; i < maxSize; i++) {
        const deviceBTN: HTMLButtonElement = document.createElement('button');
        deviceBTN.classList.add("device");
        deviceBTN.classList.add(`device-bar-${(DEVICES[i].name).replace(" ", "")}`);
        deviceBTN.title = DEVICES[i].name;

        const deviceIMG: HTMLImageElement = document.createElement('img');
        deviceIMG.src = DEVICES[i].img;

        deviceBTN.append(deviceIMG);
        deviceBar.append(deviceBTN);

        deviceBTN.addEventListener('click', () => {
            handleDeviceElementClick(DEVICES[i].name);
        });
    }

    // render 'extra device' button
    const deviceBTN: HTMLButtonElement = document.createElement('button');
    deviceBTN.classList.add("device");
    deviceBTN.classList.add("extra-device-toggle-button");
    deviceBTN.title = "All components";

    const deviceIMG: HTMLImageElement = document.createElement("img");
    deviceIMG.src = "../src/assets/ellipsis.svg";

    deviceBTN.append(deviceIMG);
    deviceBar.append(deviceBTN);

    deviceBTN.addEventListener('click', () => {
        openExtraDevices();
    });
}
const reRenderDeviceBar = (): void => {
    const visibleDevices = Array(...document.querySelectorAll(".device-bar .device"));
    
    visibleDevices.forEach(device => {
        device.remove();
    })
    
    createDeviceBar();
}
const createExtraDeviceDialog = (): void => {
    for(let i = 0; i < DEVICES.length; i++){
        extraDevices.innerHTML += `
            <button class="device" title="${DEVICES[i].name}" idx="${i}">
                <img src="${DEVICES[i].img}">
            </button>
        `;
    }
}

//========================= ZOOM IN OUT ========================//

const setZoomPercentage = (): void => {
    const percentage = Math.round(WORLD.camera.zoom * 100);
    document.querySelector('.zoom-percentage')!.textContent = `${percentage}%`;
}
const zoomIN = (): void => {
    if(WORLD.camera.zoom >= 4) return;
    WORLD.camera.zoom += 0.1;
    setZoomPercentage();
}
const zoomOUT = (): void => {
    if(WORLD.camera.zoom <= 0.2) return;
    WORLD.camera.zoom -= 0.1;
    setZoomPercentage();
}

//========================= DIALOG BOX ========================//

const closeExtraDevices = () => extraDeviceDialog.classList.add('hidden');
const closeDialog = () => {
    WORLD.dialog.show = false;
    overlay.classList.add('hidden');
    closeExtraDevices();
}
const openExtraDevices = () => {
    extraDeviceDialog.classList.remove('hidden');
    WORLD.dialog.show = true;
    overlay.classList.remove('hidden');
}

//========================= MODE ========================//

const renderModeBtn = (): void => {
    document.querySelectorAll('.mode button').forEach(tool => {
        tool.classList.remove('selected');
    });


    switch (WORLD.mode) {
        case MODE.PAN:
            buttons.pan.classList.add('selected');
            break;
        case MODE.EDIT:
            buttons.edit.classList.add('selected');
            break;
        case MODE.SIMULATE:
            buttons.simulate.classList.add('selected');
            break;
    }
}
const changeMode = (idx: number): void => {
    const modes = [MODE.PAN, MODE.EDIT, MODE.SIMULATE];

    const currentIndex = modes.indexOf(WORLD.mode);
    const newIndex = (currentIndex + idx + modes.length) % modes.length;

    WORLD.mode = modes[newIndex];

    switch (WORLD.mode) {
        case MODE.PAN:
            canvas.style.cursor = 'grab';
            break;
        case MODE.EDIT:
        case MODE.SIMULATE:
            canvas.style.cursor = 'pointer';
            break;
    }

    renderModeBtn();
}
const handleModeButtonSelection = (mode: MODE): void => {

    buttons.pan.setAttribute("aria-pressed", "false");
    buttons.edit.setAttribute("aria-pressed", "false");
    buttons.simulate.setAttribute("aria-pressed", "false");

    switch (mode) {
        case MODE.PAN:
            WORLD.mode = MODE.PAN;
            canvas.style.cursor = 'grab';

            buttons.pan.setAttribute("aria-pressed", "true");
            break;
        case MODE.EDIT:
            WORLD.mode = MODE.EDIT;
            canvas.style.cursor = 'default';

            buttons.edit.setAttribute("aria-pressed", "true");
            break;
        case MODE.SIMULATE:
            WORLD.mode = MODE.SIMULATE;
            canvas.style.cursor = 'pointer';

            buttons.simulate.setAttribute("aria-pressed", "true");
            break;
    }
    renderModeBtn();
}

//========================= UNDO REDO ========================//

const renderUndoRedoBtn = () => {
    if (HISTORY.undoStack.length <= 1) {
        buttons.undo.disabled = true;
    } else {
        buttons.undo.disabled = false;
    }

    if (HISTORY.redoStack.length === 0) {
        buttons.redo.disabled = true;
    } else {
        buttons.redo.disabled = false;
    }
}

//========================= SNAP TO GRID ====================//

const snapToGrid = () => {
    CIRCUIT.devices.forEach((device: any) => {
        const newX = Math.round(device.x / (tileSize / 2)) * (tileSize / 2);
        const newY = Math.round(device.y / (tileSize / 2)) * (tileSize / 2);

        device.x = Math.floor(newX);
        device.y = Math.floor(newY);
    });
}
const renderSnapToGridBtn = () => {
    if (SETTINGS.snapToGrid) {
        buttons.snapToGrid.classList.add('selected');
    } else {
        buttons.snapToGrid.classList.remove('selected');
    }
}

//========================= SHOW LABEL ====================//

const renderShowLabelBtn = () => {
    if (SETTINGS.showLabel) {
        buttons.showLabel.classList.add('selected');
    } else {
        buttons.showLabel.classList.remove('selected');
    }
}

//========================= DRAW ====================//

const isOutOfCanvas = (device: Device) => {
    const startX = Math.floor((WORLD.camera.x - canvas.width * (1/WORLD.camera.zoom)));
    const endX = Math.floor((WORLD.camera.x + canvas.width * (1 / WORLD.camera.zoom)));

    const startY = Math.floor((WORLD.camera.y - canvas.height * (1 / WORLD.camera.zoom)));
    const endY = Math.floor((WORLD.camera.y + canvas.height * (1 / WORLD.camera.zoom)));

    return !(device.x >= startX && device.x <= endX && device.y >= startY && device.y <= endY);
}
const drawWire = (ctx: any) => {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;

    const drawnConnections = new Set<string>();

    for (const [pinID, pin] of CIRCUIT.pins) {
        for (const connectedPinID of pin.connectedPins) {

            const connectionKey = [pinID, connectedPinID].sort().join("-");

            if (drawnConnections.has(connectionKey)) continue;

            const startPin = getPin(pinID);
            const endPin = getPin(connectedPinID);

            ctx.beginPath();
            ctx.moveTo(getPinX(startPin), getPinY(startPin));
            ctx.lineTo(getPinX(endPin), getPinY(endPin));
            ctx.stroke();

            drawnConnections.add(connectionKey);
        }
    }
};

//========================= PINS ====================//

const drawPinHovering = (pin: Pin, ctx: any) => {
    if (!isHoveringPin(pin)) return;
    if (!(WORLD.mode === MODE.EDIT)) return;

    ctx.beginPath();

    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "#ddddfe";
    ctx.strokeStyle = "#ddddfe";

    ctx.roundRect(getPinX(pin) - 10, getPinY(pin) - 10, 20, 20, 5);
    ctx.fill();
    
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;
    ctx.stroke();
}
const drawPinSelection = (pin: Pin, ctx: any) => {
    if (!pin.selected) return;

    ctx.beginPath();

    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "#ddddfe";
    ctx.strokeStyle = "#ddddfe";

    ctx.roundRect(getPinX(pin) - 10, getPinY(pin) - 10, 20, 20, 5);
    ctx.fill();
    
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;
    ctx.stroke();
}

const handlePinSelection = (pins: number[]) => {
    for (let i = 0; i < pins.length; i++){
        const pin = getPin(pins[i]);

        if (isHoveringPin(pin)) {

            // check explicitly against null since pin IDs start at 0
            if (WORLD.pin.selected !== null) {
                const selectedPin = getPin(WORLD.pin.selected);
                if (WORLD.pin.selected === pins[i]) {
                    // clicked the same pin again, cancel selection
                    getPin(WORLD.pin.selected).selected = false;
                    WORLD.pin.selected = null;
                    break;
                }

                // create a connection between previously selected pin and current pin
                Pin.connect(pin.id, WORLD.pin.selected);
                if (pin.netID == null && selectedPin.netID == null) {
                    const newNet = new Net();
                    addToNet(pin, newNet);
                    addToNet(selectedPin, newNet);
                    CIRCUIT.nets.set(newNet.id, newNet);
                } else if (pin.netID == null) {
                    addToNet(pin, CIRCUIT.nets.get(selectedPin.netID!)!)
                } else if (selectedPin.netID == null) {
                    addToNet(selectedPin, CIRCUIT.nets.get(pin.netID!)!);
                } else if (pin.netID !== selectedPin.netID) {
                    combineNets(pin, selectedPin);
                }

                if (pin.netID != null || selectedPin.netID != null) {
                    SOLVER.SolveCircuit(CIRCUIT.nets.get(pin.netID!)! ?? CIRCUIT.nets.get(selectedPin.netID!)!);
                }

                HISTORY.save(CIRCUIT);

                getPin(WORLD.pin.selected).selected = false;
                pin.selected = false;
                WORLD.pin.selected = null;
                break;
            }

            pin.selected = !pin.selected;
            WORLD.pin.selected = pin.selected ? pin.id : null;
        }
    }
}

export {
    createDeviceBar,
    reRenderDeviceBar,
    createExtraDeviceDialog,

    handleDeviceElementClick, // debug

    zoomIN,
    zoomOUT,

    closeDialog,
    openExtraDevices,

    renderModeBtn,
    changeMode,
    handleModeButtonSelection,

    drawDevices,
    updateDevice,

    renderUndoRedoBtn,

    snapToGrid,
    renderSnapToGridBtn,

    renderShowLabelBtn,

    isOutOfCanvas,
    drawWire,
    handlePinSelection,
    drawPinHovering,
    drawPinSelection
};