import { initSettings, getAllSettings } from "../../settings";
import Device from "../devices/device";
import Pin from "../devices/functions/pin";
await initSettings();

import HistoryManager from "./history";

const tileSize: number = 30;
const deviceSize: number = 50;

//=================== TYPES ===================//

enum MODE {
    PAN,
    EDIT,
    SIMULATE
}

enum DEVICE {
    SOURCE = "Source",
    GROUND = "Ground",
    BULB = "Bulb",
    SWITCH = "Switch",
    AND = "And Gate",
    OR = "Or Gate",
    NOT = "Not Gate",
    XOR = "Xor Gate",
    NAND = "Nand Gate",
    NOR = "Nor Gate",
    XNOR = "Xnor Gate"
}

interface World {
    mode: MODE,
    movingDevice: Device | null,
    pin: {
        selected: Pin | null
    }
    camera: {
        x: number,
        y: number,
        lastX: number,
        lastY: number,
        zoom: number,
        isDragging: boolean
    },
    dialog: {
        show: boolean
    }
}

interface Circuit {
    devices: Device[],
    connections: any[]
}

//=================== DECLARATIONS ===================//

let SETTINGS = await getAllSettings();

const DEVICES = [
    {
        name: DEVICE.SOURCE,
        img: "./src/assets/source.png",
    },
    {
        name: DEVICE.GROUND,
        img: "./src/assets/ground.png",
    },
    {
        name: DEVICE.BULB,
        img: "../src/assets/bulb.png",
    },
    {
        name: DEVICE.SWITCH,
        img: "../src/assets/switch.png",
    },
    {
        name: DEVICE.AND,
        img: "../src/assets/andGate.png",
    },
    {
        name: DEVICE.OR,
        img: "../src/assets/orGate.png",
    },
    {
        name: DEVICE.NOT,
        img: "../src/assets/notGate.png",
    },
    {
        name: DEVICE.XOR,
        img: "../src/assets/xorGate.png",
    },
    {
        name: DEVICE.NAND,
        img: "../src/assets/nandGate.png",
    },
    {
        name: DEVICE.NOR,
        img: "../src/assets/norGate.png",
    },
    {
        name: DEVICE.XNOR,
        img: "../src/assets/xnorGate.png",
    }
];

const WORLD:World = {
    mode: MODE.PAN,
    movingDevice: null,
    pin: {
        selected: null
    },
    camera: {
        x: 0,
        y: 0,
        lastX: 0,
        lastY: 0,
        zoom: 1,
        isDragging: false
    },
    dialog: {
        show: false
    }
};

const MOUSE = {
    x: 0,
    y: 0,
    isClicking: {
        right: false,
        left: false
    }
};

let CIRCUIT: Circuit = {
    devices: [],
    connections: []
};

const SPRITES: any = {};
DEVICES.forEach(device => {
    SPRITES[device.name] = new Image();
    SPRITES[device.name].src = device.img;
});

const HISTORY = new HistoryManager();
HISTORY.save(CIRCUIT);

export {
    deviceSize,
    tileSize,
    MODE,
    DEVICES,
    WORLD,
    MOUSE,
    CIRCUIT,
    HISTORY,
    SPRITES,
    SETTINGS,
    DEVICE
};