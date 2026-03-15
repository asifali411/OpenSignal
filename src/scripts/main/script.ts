import { 
    deviceBar, 
    extraDevices, 
    buttons, 
    canvas, 
    extraDeviceDialog, 
    overlay, 
    contextDialog, 
    transparentOverlay, 
    deleteDeviceBtn, 
    toast,
    toastMessage,
    srAnnouncer,
    saveDialog,
    saveDialogClose,
    saveDialogCancel,
    saveDialogConfirm,
    saveFilenameInput,
    saveFilenameError,
} from "./reference";
import { DEVICES, WORLD, MODE, CIRCUIT, HISTORY, tileSize, SETTINGS, DEVICE, SOLVER, VALUE, PIN_TYPE } from "./setup";

import Draw from "../devices/functions/draw";
import Create from "../devices/functions/create";
import Device, { setDeviceID } from "../devices/device";
import { getDevice, getPin, getPinX, getPinY, isHoveringPin, Point } from "./util";
import Pin, { setPinID } from "../devices/functions/pin";
import { addToNet, combineNets, Net, removeFromNet, setNetID } from "../../solver/net";
import Gate from "../devices/gate";
import Update from "../devices/functions/update";
import { Switch } from "../devices/switch";

//========================= SERIALIZATION TYPES ========================//

interface DeviceData {
    id: number;
    x: number;
    y: number;
    name: DEVICE;
    outputPins: number[];
    inputPins: number[];
    in_outPins: number[];
    offsetX: number;
    offsetY: number;
    isDragging: boolean;
    selected: boolean;
}

interface PinData {
    id: number;
    deviceID: number;
    netID: number | null;
    offsetX: number;
    offsetY: number;
    type: PIN_TYPE;
    name: string;
    value: number;
    connectedPins: number[];
}

interface NetData {
    id: number;
    value: number;
    pins: number[];
}

interface CircuitData {
    devices: DeviceData[];
    pins: PinData[];
    nets: NetData[];
}

//========================= DEVICES ========================//

const DRAW = new Draw();
const CREATE = new Create();

const drawDevices = (): void => {
    CIRCUIT.devices.forEach((device: Device) => {
        if (!isOutOfCanvas(device)) {
            switch (device.name) {
                case DEVICE.SOURCE:   DRAW.source(device);              break;
                case DEVICE.BULB:     DRAW.bulb(device);                break;
                case DEVICE.SWITCH:   DRAW.keySwitch(device as Switch); break;
                case DEVICE.AND:      DRAW.and(device);                 break;
                case DEVICE.OR:       DRAW.or(device);                  break;
                case DEVICE.NOT:      DRAW.not(device);                 break;
                case DEVICE.XOR:      DRAW.xor(device);                 break;
                case DEVICE.NAND:     DRAW.nand(device);                break;
                case DEVICE.NOR:      DRAW.nor(device);                 break;
                case DEVICE.XNOR:     DRAW.xnor(device);               break;
            }
        }
    });
};

const updateDevice = (device: Gate | Device): number => {
    switch (device.name) {
        case DEVICE.AND:  return Update.and(device);
        case DEVICE.OR:   return Update.or(device);
        case DEVICE.NOT:  return Update.not(device);
        case DEVICE.XOR:  return Update.xor(device);
        case DEVICE.NAND: return Update.nand(device);
        case DEVICE.NOR:  return Update.nor(device);
        case DEVICE.XNOR: return Update.xnor(device);
    }
    return -1;
};

const deleteDevice = (device: Device | Gate | Switch): void => {
    const pinIDsToDelete: number[] = [
        ...device.inputPins,
        ...device.outputPins,
        ...device.in_outPins
    ];

    // Reset output pin values and re-solve affected nets
    const netsToUpdate = new Set<number>();
    for (const pinID of device.outputPins) {
        const pin = getPin(pinID);
        Pin.setValue(pin, VALUE.Z);
        if (pin.netID != null) {
            netsToUpdate.add(pin.netID);
        }
    }
    for (const netID of netsToUpdate) {
        SOLVER.SolveCircuit(CIRCUIT.nets.get(netID)!);
    }

    // Disconnect all pins from their connections
    for (const pinID of pinIDsToDelete) {
        const pin = getPin(pinID);
        if (!pin) continue;

        const connectedPinsCopy = Array.from(pin.connectedPins);
        for (const connectedPinID of connectedPinsCopy) {
            Pin.disconnect(pinID, connectedPinID);
        }
    }

    // Remove pins from nets and clean up empty/tiny nets
    const processedNets = new Set<number>();
    for (const pinID of pinIDsToDelete) {
        const pin = getPin(pinID);
        if (!pin) continue;

        if (pin.netID != null && !processedNets.has(pin.netID)) {
            processedNets.add(pin.netID);

            const net = CIRCUIT.nets.get(pin.netID);
            if (!net) continue;

            removeFromNet(pin, net);

            if (net.pins.size <= 2) {
                for (const remainingPinID of net.pins) {
                    const remainingPin = getPin(remainingPinID);
                    if (remainingPin) remainingPin.netID = null;
                }
                CIRCUIT.nets.delete(net.id);
            }
        }

        CIRCUIT.pins.delete(pinID);
    }

    CIRCUIT.devices.delete(device.id);
    HISTORY.save(CIRCUIT);
};

//========================= DEVICE BAR ========================//

const createExtraDeviceDialog = (): void => {
    for (let i = 0; i < DEVICES.length; i++) {
        const deviceBTN = document.createElement("button");
        deviceBTN.classList.add("device");
        deviceBTN.title = DEVICES[i].name;

        const deviceIMG = document.createElement("img");
        deviceIMG.src = DEVICES[i].img;

        deviceBTN.append(deviceIMG);
        extraDevices.append(deviceBTN);

        deviceBTN.addEventListener('click', () => {
            closeDialog();
            handleDeviceElementClick(DEVICES[i].name);
        });
    }
};

const setupContextMenuListeners = (): void => {
    deleteDeviceBtn.addEventListener('click', () => {
        for (const [deviceID, device] of CIRCUIT.devices) {
            if (device.selected) {
                deleteDevice(getDevice(deviceID));
                break;
            }
        }
        closeDialog();
    });
};

const handleDeviceElementClick = (deviceName: DEVICE): void => {
    switch (deviceName) {
        case DEVICE.SOURCE: CREATE.source();    break;
        case DEVICE.BULB:   CREATE.bulb();      break;
        case DEVICE.SWITCH: CREATE.keySwitch(); break;
        case DEVICE.AND:    CREATE.and();        break;
        case DEVICE.OR:     CREATE.or();         break;
        case DEVICE.NOT:    CREATE.not();        break;
        case DEVICE.XOR:    CREATE.xor();        break;
        case DEVICE.NAND:   CREATE.nand();       break;
        case DEVICE.NOR:    CREATE.nor();        break;
        case DEVICE.XNOR:   CREATE.xnor();      break;
        default:
            console.error(`Device name not recognized: ${deviceName}`);
            return;
    }

    if (SETTINGS.snapToGrid) snapToGrid();
    HISTORY.save(CIRCUIT);
};

const createDeviceBar = (): void => {
    const maxSize = Math.min(Math.floor(deviceBar.getBoundingClientRect().width / 60), DEVICES.length);
    
    for (let i = 0; i < maxSize; i++) {
        const deviceBTN = document.createElement('button');
        deviceBTN.classList.add("device");
        deviceBTN.classList.add(`device-bar-${DEVICES[i].name.replace(" ", "")}`);
        deviceBTN.title = DEVICES[i].name;

        const deviceIMG = document.createElement('img');
        deviceIMG.src = DEVICES[i].img;

        deviceBTN.append(deviceIMG);
        deviceBar.append(deviceBTN);

        deviceBTN.addEventListener('click', () => {
            handleDeviceElementClick(DEVICES[i].name);
        });
    }

    const deviceBTN = document.createElement('button');
    deviceBTN.classList.add("device", "extra-device-toggle-button");
    deviceBTN.title = "All Devices";

    const deviceIMG = document.createElement("img");
    deviceIMG.src = "../src/assets/ellipsis.svg";

    deviceBTN.append(deviceIMG);
    deviceBar.append(deviceBTN);

    deviceBTN.addEventListener('click', () => {
        openExtraDevices();
    });
};

const reRenderDeviceBar = (): void => {
    document.querySelectorAll<HTMLElement>(".device-bar .device").forEach(device => {
        device.remove();
    });
    createDeviceBar();
};

//========================= ZOOM ========================//

const setZoomPercentage = (): void => {
    const percentage = Math.round(WORLD.camera.zoom * 100);
    document.querySelector('.zoom-percentage')!.textContent = `${percentage}%`;
};

const zoomIN = (): void => {
    if (WORLD.camera.zoom >= 4) return;
    WORLD.camera.zoom += 0.1;
    setZoomPercentage();
};

const zoomOUT = (): void => {
    if (WORLD.camera.zoom <= 0.2) return;
    WORLD.camera.zoom -= 0.1;
    setZoomPercentage();
};

//========================= DIALOG BOX ========================//

const closeExtraDevices = (): void => extraDeviceDialog.classList.add('hidden');

const closeContextDialog = (): void => {
    contextDialog.classList.add('hidden');
    contextDialog.inert = true;
    contextDialog.setAttribute('aria-hidden', 'true');
};

const closeDialog = (): void => {
    WORLD.dialog.show = false;
    overlay.classList.add('hidden');
    transparentOverlay.classList.add('hidden');
    closeExtraDevices();
    closeContextDialog();

    CIRCUIT.devices.forEach((device: Device) => {
        device.selected = false;
    });
};

const openExtraDevices = (): void => {
    extraDeviceDialog.classList.remove('hidden');
    WORLD.dialog.show = true;
    overlay.classList.remove('hidden');
};

const openContextDialog = (point: Point): void => {
    contextDialog.classList.remove('hidden');
    WORLD.dialog.show = true;
    transparentOverlay.classList.remove('hidden');

    contextDialog.inert = false;
    contextDialog.removeAttribute('aria-hidden');

    contextDialog.style.left = `${point.x}px`;
    contextDialog.style.top  = `${point.y}px`;
};

//========================= SAVE DIALOG ========================//

const openSaveDialog = (): void => {
    saveDialog.classList.remove('hidden');
    overlay.classList.remove('hidden');
    saveDialog.removeAttribute('inert');
    saveDialog.setAttribute('aria-hidden', 'false');
    WORLD.dialog.show = true;
    saveFilenameInput.select();
    saveFilenameInput.focus();
};

const closeSaveDialog = (): void => {
    saveDialog.classList.add('hidden');
    overlay.classList.add('hidden');
    saveDialog.setAttribute('inert', '');
    saveDialog.setAttribute('aria-hidden', 'true');
    saveFilenameError.classList.add('hidden');
    saveFilenameInput.removeAttribute('aria-invalid');
    WORLD.dialog.show = false;
    buttons.save.focus();
};

const announceSaveResult = (filename: string): void => {
    srAnnouncer.textContent = '';
    requestAnimationFrame(() => {
        srAnnouncer.textContent = `Circuit saved as ${filename}.json`;
    });
    setTimeout(() => { srAnnouncer.textContent = ''; }, 3000);
};

const trapFocusInSaveDialog = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') { closeSaveDialog(); return; }
    if (e.key !== 'Tab') return;

    const focusable = Array.from(
        saveDialog.querySelectorAll<HTMLElement>('button, input, [tabindex]:not([tabindex="-1"])')
    ).filter(el => !(el as HTMLButtonElement).disabled);

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
};

const setupSaveDialogListeners = (): void => {
    saveDialogClose.addEventListener('click', closeSaveDialog);
    saveDialogCancel.addEventListener('click', closeSaveDialog);
    saveDialogConfirm.addEventListener('click', confirmSave);
    saveDialog.addEventListener('keydown', trapFocusInSaveDialog);
    saveFilenameInput.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') confirmSave();
    });
};

// Called when the user clicks Save in the dialog
const confirmSave = (): void => {
    const name = saveFilenameInput.value.trim();

    if (!name) {
        saveFilenameError.classList.remove('hidden');
        saveFilenameInput.setAttribute('aria-invalid', 'true');
        saveFilenameInput.focus();
        return;
    }

    saveFilenameError.classList.add('hidden');
    saveFilenameInput.removeAttribute('aria-invalid');
    closeSaveDialog();
    saveCircuit(name);
};

//========================= MODE ========================//

const renderModeBtn = (): void => {
    document.querySelectorAll('.mode button').forEach(tool => {
        tool.classList.remove('selected');
    });

    switch (WORLD.mode) {
        case MODE.EDIT:     buttons.edit.classList.add('selected');     break;
        case MODE.SIMULATE: buttons.simulate.classList.add('selected'); break;
    }
};

const changeMode = (idx: number): void => {
    const modes: MODE[] = [MODE.EDIT, MODE.SIMULATE];
    const newIndex = (modes.indexOf(WORLD.mode) + idx + modes.length) % modes.length;
    WORLD.mode = modes[newIndex];

    switch (WORLD.mode) {
        case MODE.EDIT:     canvas.style.cursor = 'default';  break;
        case MODE.SIMULATE: canvas.style.cursor = 'pointer'; break;
    }

    renderModeBtn();
};

const handleModeButtonSelection = (mode: MODE): void => {
    buttons.edit.setAttribute("aria-pressed", "false");
    buttons.simulate.setAttribute("aria-pressed", "false");

    switch (mode) {
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
};

//========================= UNDO REDO ========================//

const renderUndoRedoBtn = (): void => {
    buttons.undo.disabled = HISTORY.undoStack.length <= 1;
    buttons.redo.disabled = HISTORY.redoStack.length === 0;
};

//========================= SNAP TO GRID ====================//

const snapToGrid = (): void => {
    CIRCUIT.devices.forEach((device: Device) => {
        device.x = Math.floor(Math.round(device.x / (tileSize / 2)) * (tileSize / 2));
        device.y = Math.floor(Math.round(device.y / (tileSize / 2)) * (tileSize / 2));
    });
};

const renderSnapToGridBtn = (): void => {
    buttons.snapToGrid.classList.toggle('selected', SETTINGS.snapToGrid);
};

//========================= SHOW LABEL ====================//

const renderShowLabelBtn = (): void => {
    buttons.showLabel.classList.toggle('selected', SETTINGS.showLabel);
};

//========================= DRAW ====================//

const isOutOfCanvas = (device: Device): boolean => {
    const startX = Math.floor(WORLD.camera.x - canvas.width  * (1 / WORLD.camera.zoom));
    const endX   = Math.floor(WORLD.camera.x + canvas.width  * (1 / WORLD.camera.zoom));
    const startY = Math.floor(WORLD.camera.y - canvas.height * (1 / WORLD.camera.zoom));
    const endY   = Math.floor(WORLD.camera.y + canvas.height * (1 / WORLD.camera.zoom));

    return !(device.x >= startX && device.x <= endX && device.y >= startY && device.y <= endY);
};

const drawWire = (ctx: CanvasRenderingContext2D): void => {
    ctx.lineWidth = 3;

    const drawnConnections = new Set<string>();

    for (const [pinID, pin] of CIRCUIT.pins) {
        ctx.strokeStyle = pin.value === VALUE.HIGH ? "yellowgreen" : "#333";
        for (const connectedPinID of pin.connectedPins) {
            const connectionKey = [pinID, connectedPinID].sort().join("-");
            if (drawnConnections.has(connectionKey)) continue;

            const startPin = getPin(pinID);
            const endPin   = getPin(connectedPinID);

            ctx.beginPath();
            ctx.moveTo(getPinX(startPin), getPinY(startPin));
            ctx.lineTo(getPinX(endPin),   getPinY(endPin));
            ctx.stroke();

            drawnConnections.add(connectionKey);
        }
    }
};

//========================= PINS ====================//

const drawPinHovering = (pin: Pin, ctx: CanvasRenderingContext2D): void => {
    if (!isHoveringPin(pin) || WORLD.mode !== MODE.EDIT) return;

    ctx.beginPath();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "#ddddfe";
    ctx.strokeStyle = "#ddddfe";
    ctx.roundRect(getPinX(pin) - 10, getPinY(pin) - 10, 20, 20, 5);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;
    ctx.stroke();
};

const drawPinSelection = (pin: Pin, ctx: CanvasRenderingContext2D): void => {
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
};

const handlePinSelection = (pins: number[]): void => {
    for (let i = 0; i < pins.length; i++) {
        const pin = getPin(pins[i]);
        if (!isHoveringPin(pin)) continue;

        if (WORLD.pin.selected !== null) {
            const selectedPin = getPin(WORLD.pin.selected);

            // Clicked the same pin again — cancel selection
            if (WORLD.pin.selected === pins[i]) {
                selectedPin.selected = false;
                WORLD.pin.selected = null;
                break;
            }

            // Pins already connected — disconnect them
            if (selectedPin.connectedPins.has(pin.id)) {
                Pin.disconnect(WORLD.pin.selected, pin.id);
                selectedPin.selected = false;
                WORLD.pin.selected = null;
                HISTORY.save(CIRCUIT);
                break;
            }

            // Connect the two pins and assign/merge nets
            Pin.connect(pin.id, WORLD.pin.selected);

            if (pin.netID == null && selectedPin.netID == null) {
                const newNet = new Net();
                addToNet(pin, newNet);
                addToNet(selectedPin, newNet);
                CIRCUIT.nets.set(newNet.id, newNet);
            } else if (pin.netID == null) {
                addToNet(pin, CIRCUIT.nets.get(selectedPin.netID!)!);
            } else if (selectedPin.netID == null) {
                addToNet(selectedPin, CIRCUIT.nets.get(pin.netID!)!);
            } else if (pin.netID !== selectedPin.netID) {
                combineNets(pin, selectedPin);
            }

            const resolvedNet = CIRCUIT.nets.get(pin.netID!) ?? CIRCUIT.nets.get(selectedPin.netID!);
            if (resolvedNet) {
                SOLVER.SolveCircuit(resolvedNet);
            }

            selectedPin.selected = false;
            pin.selected = false;
            WORLD.pin.selected = null;

            HISTORY.save(CIRCUIT);
            break;
        }

        pin.selected = !pin.selected;
        WORLD.pin.selected = pin.selected ? pin.id : null;
    }
};

//========================= TOAST ====================//

const showToast = (message: string): void => {
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    toast.removeAttribute('inert');

    setTimeout(() => {
        toast.classList.add('hidden');
        toast.setAttribute('inert', '');
    }, 1300);
};

//========================= FILE ====================//

const deconstructCircuit = (): CircuitData => {
    const data: CircuitData = {
        devices: [],
        pins: [],
        nets: []
    };

    for (const [, device] of CIRCUIT.devices) {
        data.devices.push({
            id:          device.id,
            x:           device.x,
            y:           device.y,
            name:        device.name,
            outputPins:  device.outputPins,
            inputPins:   device.inputPins,
            in_outPins:  device.in_outPins,
            offsetX:     device.offsetX,
            offsetY:     device.offsetY,
            isDragging:  device.isDragging,
            selected:    device.selected
        });
    }

    for (const [, pin] of CIRCUIT.pins) {
        data.pins.push({
            id:            pin.id,
            deviceID:      pin.deviceID,
            netID:         pin.netID,
            offsetX:       pin.offsetX,
            offsetY:       pin.offsetY,
            type:          pin.type,
            name:          pin.name,
            value:         pin.value,
            connectedPins: Array.from(pin.connectedPins)
        });
    }

    for (const [, net] of CIRCUIT.nets) {
        data.nets.push({
            id:    net.id,
            value: net.value,
            pins:  Array.from(net.pins)
        });
    }

    return data;
};

const loadCircuit = (data: CircuitData): void => {
    CIRCUIT.devices.clear();
    CIRCUIT.pins.clear();
    CIRCUIT.nets.clear();

    for (const deviceData of data.devices) {
        const device = new Device(deviceData.x, deviceData.y, deviceData.name);
        device.id          = deviceData.id;
        device.inputPins   = deviceData.inputPins;
        device.outputPins  = deviceData.outputPins;
        device.in_outPins  = deviceData.in_outPins;
        device.offsetX     = deviceData.offsetX;
        device.offsetY     = deviceData.offsetY;
        device.isDragging  = deviceData.isDragging;
        device.selected    = deviceData.selected;
        CIRCUIT.devices.set(device.id, device);
    }

    for (const pinData of data.pins) {
        const pin = new Pin(pinData.deviceID, pinData.offsetX, pinData.offsetY, pinData.type, pinData.name);
        pin.id            = pinData.id;
        pin.netID         = pinData.netID;
        pin.value         = pinData.value;
        pin.connectedPins = new Set(pinData.connectedPins);
        CIRCUIT.pins.set(pin.id, pin);
    }

    for (const netData of data.nets) {
        const net = new Net();
        net.id    = netData.id;
        net.value = netData.value;
        net.pins  = new Set<number>(netData.pins);
        CIRCUIT.nets.set(net.id, net);
    }

    // Advance global counters past the highest loaded IDs
    if (CIRCUIT.devices.size > 0) {
        setDeviceID(Math.max(...CIRCUIT.devices.keys()) + 1);
    }
    if (CIRCUIT.pins.size > 0) {
        setPinID(Math.max(...CIRCUIT.pins.keys()) + 1);
    }
    if (CIRCUIT.nets.size > 0) {
        setNetID(Math.max(...CIRCUIT.nets.keys()) + 1);
    }

    HISTORY.save(CIRCUIT);
};

//========================= FILE I/O ========================//

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.json';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

fileInput.addEventListener('change', (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
        try {
            const data = JSON.parse(readerEvent.target?.result as string) as CircuitData;
            loadCircuit(data);
        } catch (err) {
            console.error("Error loading circuit", err);
            alert("Invalid circuit file");
        }
    };
    reader.readAsText(file);
    fileInput.value = '';
});

// Accepts the filename from the save dialog — called by confirmSave()
const saveCircuit = (filename: string): void => {
    if (CIRCUIT.devices.size === 0) {
        showToast("Nothing to save — add some components first.");
        return;
    }

    const data = JSON.stringify(deconstructCircuit(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Saved as "${filename}.json"`);
    announceSaveResult(filename);
};

const openCircuit = (): void => {
    fileInput.click();
};

export {
    createDeviceBar,
    reRenderDeviceBar,
    createExtraDeviceDialog,
    setupContextMenuListeners,

    zoomIN,
    zoomOUT,

    closeDialog,
    openExtraDevices,
    openContextDialog,

    openSaveDialog,
    closeSaveDialog,
    setupSaveDialogListeners,

    renderModeBtn,
    changeMode,
    handleModeButtonSelection,

    drawDevices,
    updateDevice,
    deleteDevice,

    renderUndoRedoBtn,

    snapToGrid,
    renderSnapToGridBtn,

    renderShowLabelBtn,

    isOutOfCanvas,
    drawWire,
    handlePinSelection,
    drawPinHovering,
    drawPinSelection,

    deconstructCircuit,
    saveCircuit,
    openCircuit,
};