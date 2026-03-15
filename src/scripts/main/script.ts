import { 
    deviceBar, 
    extraDevices, 
    buttons, 
    canvas, 
    extraDeviceDialog, 
    overlay, 
    contextDialog, 
    transparentOverlay, 
    // seeDetailsBtn,
    deleteDeviceBtn } from "./reference";
import { DEVICES, WORLD, MODE, CIRCUIT, HISTORY, tileSize, SETTINGS, DEVICE, SOLVER, VALUE } from "./setup";

import Draw from "../devices/functions/draw";
import Create from "../devices/functions/create";
import Device, { setDeviceID } from "../devices/device";
import { getDevice, getPin, getPinX, getPinY, isHoveringPin, Point } from "./util";
import Pin, { setPinID } from "../devices/functions/pin";
import { addToNet, combineNets, Net, removeFromNet, setNetID } from "../../solver/net";
import Gate from "../devices/gate";
import Update from "../devices/functions/update";
import { Switch } from "../devices/switch";

//========================= DEVICES ========================//

const DRAW = new Draw();
const CREATE = new Create();

const drawDevices = (): void => {
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
                    DRAW.keySwitch(device as Switch);
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
};

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
};

const deleteDevice = (device: Device | Gate | Switch): void => {
    const pinIDsToDelete: number[] = [
        ...device.inputPins,
        ...device.outputPins,
        ...device.in_outPins
    ];

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

    const processedNets = new Set<number>();

    // disconnect all pin connections
    for (const pinID of pinIDsToDelete) {
        const pin = getPin(pinID);
        if (!pin) continue;

        const connectedPinsCopy = Array.from(pin.connectedPins);

        for (const connectedPinID of connectedPinsCopy) {
            Pin.disconnect(pinID, connectedPinID);
        }
    }

    // remove pins from nets
    for (const pinID of pinIDsToDelete) {
        const pin = getPin(pinID);
        if (!pin) continue;

        if (pin.netID != null && !processedNets.has(pin.netID)) {
            processedNets.add(pin.netID);

            const net = CIRCUIT.nets.get(pin.netID);
            if (!net) continue;

            removeFromNet(pin, net);

            if (net.pins.size <= 2) {
                for (const remainingPin of net.pins) {
                    remainingPin.netID = null;
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

        const deviceBTN: HTMLButtonElement = document.createElement("button");
        deviceBTN.classList.add("device");
        deviceBTN.title = DEVICES[i].name;

        const deviceIMG: HTMLImageElement = document.createElement("img");
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
    // seeDetailsBtn.addEventListener('click', () => {
    //     console.log('See details clicked');
    //     closeDialog();
    // });

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
};

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
    deviceBTN.title = "All Devices";

    const deviceIMG: HTMLImageElement = document.createElement("img");
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

//========================= ZOOM IN OUT ========================//

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
    contextDialog.style.top = `${point.y}px`;
}

//========================= MODE ========================//

const renderModeBtn = (): void => {
    document.querySelectorAll('.mode button').forEach(tool => {
        tool.classList.remove('selected');
    });

    switch (WORLD.mode) {
        case MODE.EDIT:
            buttons.edit.classList.add('selected');
            break;
        case MODE.SIMULATE:
            buttons.simulate.classList.add('selected');
            break;
    }
};

const changeMode = (idx: number): void => {
    const modes: MODE[] = [MODE.EDIT, MODE.SIMULATE];

    const currentIndex = modes.indexOf(WORLD.mode);
    const newIndex = (currentIndex + idx + modes.length) % modes.length;

    WORLD.mode = modes[newIndex];

    switch (WORLD.mode) {
        case MODE.EDIT:
            canvas.style.cursor = 'default';
            break;
        case MODE.SIMULATE:
            canvas.style.cursor = 'pointer';
            break;
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
        const newX = Math.round(device.x / (tileSize / 2)) * (tileSize / 2);
        const newY = Math.round(device.y / (tileSize / 2)) * (tileSize / 2);

        device.x = Math.floor(newX);
        device.y = Math.floor(newY);
    });
};

const renderSnapToGridBtn = (): void => {
    if (SETTINGS.snapToGrid) {
        buttons.snapToGrid.classList.add('selected');
    } else {
        buttons.snapToGrid.classList.remove('selected');
    }
};

//========================= SHOW LABEL ====================//

const renderShowLabelBtn = (): void => {
    if (SETTINGS.showLabel) {
        buttons.showLabel.classList.add('selected');
    } else {
        buttons.showLabel.classList.remove('selected');
    }
};

//========================= DRAW ====================//

const isOutOfCanvas = (device: Device): boolean => {
    const startX = Math.floor((WORLD.camera.x - canvas.width * (1 / WORLD.camera.zoom)));
    const endX = Math.floor((WORLD.camera.x + canvas.width * (1 / WORLD.camera.zoom)));

    const startY = Math.floor((WORLD.camera.y - canvas.height * (1 / WORLD.camera.zoom)));
    const endY = Math.floor((WORLD.camera.y + canvas.height * (1 / WORLD.camera.zoom)));

    return !(device.x >= startX && device.x <= endX && device.y >= startY && device.y <= endY);
};

const drawWire = (ctx: CanvasRenderingContext2D): void => {
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

const drawPinHovering = (pin: Pin, ctx: CanvasRenderingContext2D): void => {
    if (!isHoveringPin(pin)) return;
    if (WORLD.mode !== MODE.EDIT) return;

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

                if(getPin(WORLD.pin.selected).connectedPins.has(pin.id)){
                    Pin.disconnect(WORLD.pin.selected, pin.id);
                    getPin(WORLD.pin.selected).selected = false;
                    WORLD.pin.selected = null;
                    HISTORY.save(CIRCUIT);
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
                    addToNet(pin, CIRCUIT.nets.get(selectedPin.netID!)!);
                } else if (selectedPin.netID == null) {
                    addToNet(selectedPin, CIRCUIT.nets.get(pin.netID!)!);
                } else if (pin.netID !== selectedPin.netID) {
                    combineNets(pin, selectedPin);
                }

                if (pin.netID != null || selectedPin.netID != null) {
                    SOLVER.SolveCircuit(CIRCUIT.nets.get(pin.netID!)! ?? CIRCUIT.nets.get(selectedPin.netID!)!);
                }

                getPin(WORLD.pin.selected).selected = false;
                pin.selected = false;
                WORLD.pin.selected = null;

                HISTORY.save(CIRCUIT);
                break;
            }

            pin.selected = !pin.selected;
            WORLD.pin.selected = pin.selected ? pin.id : null;
        }
    }
};

//========================= FILE ====================//

const deconstructCircuit = () => {
    const data: any = {
        devices: [],
        pins: [],
        nets: []
    };

    for(const [,device] of CIRCUIT.devices){
        let deviceData = {
            id: device.id,
            x: device.x,
            y: device.y,
            name: device.name,
            outputPins: device.outputPins,
            inputPins: device.inputPins,
            in_outPins: device.in_outPins,
            offsetX: device.offsetX,
            offsetY: device.offsetY,
            isDragging: device.isDragging,
            selected: device.selected
        }

        data.devices.push(deviceData);
    }

    for(const [,pin] of CIRCUIT.pins){
        let pinData = {
            id: pin.id,
            deviceID: pin.deviceID,
            netID: pin.netID,
            offsetX: pin.offsetX,
            offsetY: pin.offsetY,
            type: pin.type,
            name: pin.name,
            value: pin.value,
            connectedPins: Array.from(pin.connectedPins)
        }

        data.pins.push(pinData);
    }

    for(const [,net] of CIRCUIT.nets){

        let netData = {
            id: net.id,
            value: net.value,
            pins: Array.from(net.pins).map(pin => pin.id)
        }

        data.nets.push(netData);
    }

    return data;
}

const loadCircuit = (data: any) => {
    CIRCUIT.devices.clear();
    CIRCUIT.pins.clear();
    CIRCUIT.nets.clear();

    console.log(data.pins);

    data.devices.forEach((deviceData: any) => {
        const device = new Device(deviceData.x, deviceData.y, deviceData.name);
        device.id = deviceData.id;
        device.inputPins = deviceData.inputPins;
        device.outputPins = deviceData.outputPins;
        device.in_outPins = deviceData.in_outPins;
        device.offsetX = deviceData.offsetX;
        device.offsetY = deviceData.offsetY;
        device.isDragging = deviceData.isDragging;
        device.selected = deviceData.selected;
        CIRCUIT.devices.set(device.id, device);
    });

    data.pins.forEach((pinData: any) => {
        const pin = new Pin(pinData.deviceID, pinData.offsetX, pinData.offsetY, pinData.type, pinData.name);
        pin.id = pinData.id;
        pin.netID = pinData.netID;
        pin.value = pinData.value;
        pin.connectedPins = new Set(pin.connectedPins);
        CIRCUIT.pins.set(pin.id, pin);
    });

    data.nets.forEach((netData: any) => {
        const net = new Net();
        net.id = netData.id;
        net.value = netData.value;
        net.pins = new Set(netData.pins.map((id: number) => CIRCUIT.pins.get(id)!));
        CIRCUIT.nets.set(net.id, net);
    })

    // Update global IDs
    if (CIRCUIT.devices.size > 0) {
        setDeviceID(Math.max(...Array.from(CIRCUIT.devices.keys())) + 1);
    }
    if (CIRCUIT.pins.size > 0) {
        setPinID(Math.max(...Array.from(CIRCUIT.pins.keys())) + 1);
    }
    if (CIRCUIT.nets.size > 0) {
        setNetID(Math.max(...Array.from(CIRCUIT.nets.keys())) + 1);
    }

    // HISTORY.save(CIRCUIT);
}

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.json';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

fileInput.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if(file){
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
            try{
                const data = JSON.parse(readerEvent.target?.result as string);
                loadCircuit(data);

            } catch (err) {
                console.error("Error loading circuit", err);
                alert("Invalid circuit file");
            }
        };

        reader.readAsText(file);
    }

    fileInput.value = '';
})

const saveCircuit = () => {
    const data = JSON.stringify(deconstructCircuit(), null, 2);

    const blob = new Blob([data], {
        type: 'application/json'
    });


    const url = URL.createObjectURL(blob)

    const a = document.createElement('a');
    a.href = url;
    a.download = 'circuit.json';

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

const openCircuit = () => {
    fileInput.click();
}

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
    openCircuit
};