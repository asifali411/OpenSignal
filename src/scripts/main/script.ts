import { deviceBar, extraDevices, buttons, canvas, extraDeviceDialog, overlay } from "./reference";
import { DEVICES, WORLD, MODE, CIRCUIT, HISTORY, tileSize, SETTINGS, DEVICE } from "./setup";

import Draw from "../devices/functions/draw";
import Create from "../devices/functions/create";
import Device from "../devices/device";
import Connection from "../devices/functions/connection";
import { getPin, getPinX, getPinY, isHoveringPin } from "./util";
import Pin from "../devices/functions/pin";
import { addToNet, combineNets, Net } from "../../solver/net";

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
            }
        }
    });
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

const isOutOfCanvas = (device: Device) => {
    const startX = Math.floor((WORLD.camera.x - canvas.width * (1/WORLD.camera.zoom)));
    const endX = Math.floor((WORLD.camera.x + canvas.width * (1 / WORLD.camera.zoom)));

    const startY = Math.floor((WORLD.camera.y - canvas.height * (1 / WORLD.camera.zoom)));
    const endY = Math.floor((WORLD.camera.y + canvas.height * (1 / WORLD.camera.zoom)));

    return !(device.x >= startX && device.x <= endX && device.y >= startY && device.y <= endY);
}
const drawWire = (ctx: any) => {
    ctx.beginPath();

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;

    CIRCUIT.connections.forEach((connection: Connection) => {
        const FROM = getPin(connection.FROM);
        const TO = getPin(connection.TO);
        ctx.moveTo(getPinX(FROM), getPinY(FROM));
        ctx.lineTo(getPinX(TO), getPinY(TO));
        ctx.stroke();
    });
}
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
const drawPins = (ctx: any) => {

    for (const [, pin] of CIRCUIT.pins) {
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(getPinX(pin), getPinY(pin), 5, 0, Math.PI * 2);
        ctx.fill();
        drawPinHovering(pin, ctx);
        drawPinSelection(pin, ctx);

        ctx.fillText(String(pin.value), getPinX(pin), getPinY(pin) - 5); //DEBUG
    }
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
                CIRCUIT.connections.push(new Connection(WORLD.pin.selected, pin.id));
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

                HISTORY.save(CIRCUIT); // save state right after adding connection

                getPin(WORLD.pin.selected).selected = false;
                pin.selected = false;
                WORLD.pin.selected = null;
                break;
            }

            pin.selected = !pin.selected;
            WORLD.pin.selected = pin.selected ? pin.id : null;
            HISTORY.save(CIRCUIT); // record selection change
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

    renderUndoRedoBtn,

    snapToGrid,
    renderSnapToGridBtn,

    isOutOfCanvas,
    drawWire,
    handlePinSelection,
    drawPins
};