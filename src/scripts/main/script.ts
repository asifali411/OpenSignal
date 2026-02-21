import { deviceBar, extraDevices, buttons, canvas, extraDeviceDialog, overlay } from "./reference";
import { DEVICES, WORLD, MODE, CIRCUIT, HISTORY, tileSize, SETTINGS } from "./setup";

import Draw from "../devices/functions/draw";
import Create from "../devices/functions/create";

//========================= DEVICES ========================//

const DRAW = new Draw();
const CREATE = new Create();

const drawDevices = () => {
    CIRCUIT.devices.forEach((device: any) => {
        switch (device.name) {
            case "Source":
                DRAW.source(device);
                break;
            case "Ground":
                DRAW.ground(device);
                break;
        }
    });
}

//========================= DEVICE BAR ========================//

const handleDeviceElementClick = (deviceName: string): void => {
    switch (deviceName) {
        case "Source":
            CREATE.source();
            break;
        case "Ground":
            CREATE.ground();
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
            canvas.style.cursor = 'pointer';

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

export {
    createDeviceBar,
    reRenderDeviceBar,
    createExtraDeviceDialog,

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
    renderSnapToGridBtn
};