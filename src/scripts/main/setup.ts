import { initSettings, getAllSettings, AppSettings } from "../../settings";
import { Net } from "../../solver/net";
import Solver from "../../solver/solver";
import Device from "../devices/device";
import Pin from "../devices/functions/pin";
import { Switch } from "../devices/switch";
import HistoryManager from "./history";
import { setupSaveDialogListeners } from "./script";

const tileSize: number = 30;
const gridSize: number = 200;
const deviceSize: number = 50;
const maxDelta: number = 100;

//=================== TYPES ===================//

enum MODE {
    EDIT,
    SIMULATE
}

enum PIN_TYPE {
    INPUT,
    OUTPUT,
    INOUT
}

enum VALUE {
    LOW,
    HIGH,
    Z,
    X
}

enum DEVICE {
    SOURCE = "Source",
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
        selected: number | null
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
    devices: Map<number, Device | Switch>,
    pins: Map<number, Pin>,
    nets: Map<number, Net>
}

interface Grid {
    devices: Map<string, Set<number> >,
    pins: Map<string, Set<number>>
}

//=================== DECLARATIONS ===================//

let SETTINGS: AppSettings;

export async function settingsReady (): Promise<void> {
    await initSettings();
    SETTINGS = await getAllSettings();
}

const DEVICES = [
    {
        name: DEVICE.SOURCE,
        img: new URL("../../assets/source.png", import.meta.url).href,
    },
    {
        name: DEVICE.SWITCH,
        img: new URL("../../assets/switch.png", import.meta.url).href,
    },
    {
        name: DEVICE.BULB,
        img: new URL("../../assets/bulb.png", import.meta.url).href,
    },
    {
        name: DEVICE.AND,
        img: new URL("../../assets/andGate.png", import.meta.url).href,
    },
    {
        name: DEVICE.OR,
        img: new URL("../../assets/orGate.png", import.meta.url).href,
    },
    {
        name: DEVICE.NOT,
        img: new URL("../../assets/notGate.png", import.meta.url).href,
    },
    {
        name: DEVICE.XOR,
        img: new URL("../../assets/xorGate.png", import.meta.url).href,
    },
    {
        name: DEVICE.NAND,
        img: new URL("../../assets/nandGate.png", import.meta.url).href,
    },
    {
        name: DEVICE.NOR,
        img: new URL("../../assets/norGate.png", import.meta.url).href,
    },
    {
        name: DEVICE.XNOR,
        img: new URL("../../assets/xnorGate.png", import.meta.url).href,
    }
];

const WORLD:World = {
    mode: MODE.EDIT,
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
    lastX: 0,
    lastY: 0,
    isClicking: {
        right: false,
        left: false
    }
};

let CIRCUIT: Circuit = {
    devices: new Map(),
    pins: new Map(),
    nets: new Map()
};

let GRID: Grid = {
    devices: new Map(),
    pins: new Map()
}

const SPRITES: any = {};
export async function loadSprites(): Promise<void[]> {
    return Promise.all(
        DEVICES.map(device => new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => { SPRITES[device.name] = img; resolve(); };
            img.onerror = reject;
            img.src = device.img;
        }))
    );
}

const HISTORY = new HistoryManager();
HISTORY.save(CIRCUIT);

const SOLVER = new Solver();

setupSaveDialogListeners();

export {
    deviceSize,
    tileSize,
    maxDelta,
    gridSize,
    MODE,
    PIN_TYPE,
    DEVICES,
    WORLD,
    MOUSE,
    CIRCUIT,
    HISTORY,
    SPRITES,
    SETTINGS,
    DEVICE,
    SOLVER,
    VALUE,
    GRID
};