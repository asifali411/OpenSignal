import HistoryManager from "./history";

const tileSize: number = 30;
const deviceSize: number = 50;

//=================== TYPES ===================//

enum MODE {
    PAN,
    EDIT,
    SIMULATE
}

interface World {
    mode: MODE,
    movingDevice: any;
    camera: any,
    dialog: any
}

//=================== DECLARATIONS ===================//

const DEVICES = [
    {
        name: "Source",
        img: "./src/assets/source.png",
    },
    {
        name: "Ground",
        img: "./src/assets/ground.png",
    },
    {
        name: "Bulb",
        img: "../src/assets/bulb.png",
    },
    {
        name: "Cell",
        img: "../src/assets/cell.png",
    },
    {
        name: "Switch",
        img: "../src/assets/switch.png",
    },
    {
        name: "Resistor",
        img: "../src/assets/resistor.png",
    },
    {
        name: "AND Gate",
        img: "../src/assets/andGate.png",
    },
    {
        name: "OR Gate",
        img: "../src/assets/orGate.png",
    },
    {
        name: "NOT Gate",
        img: "../src/assets/notGate.png",
    },
    {
        name: "XOR Gate",
        img: "../src/assets/xorGate.png",
    },
    {
        name: "NAND Gate",
        img: "../src/assets/nandGate.png",
    },
    {
        name: "NOR Gate",
        img: "../src/assets/norGate.png",
    },
    {
        name: "XNOR Gate",
        img: "../src/assets/xnorGate.png",
    }
];

const WORLD:World = {
    mode: MODE.PAN,
    movingDevice: null,
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

let CIRCUIT: any = {
    devices: [],
    connection: []
};

const SPRITES: any = {};
DEVICES.forEach(device => {
    SPRITES[device.name] = new Image();
    SPRITES[device.name].src = device.img;
});

const HISTORY = new HistoryManager();
HISTORY.save(CIRCUIT);

export {
    MODE,
    DEVICES,
    WORLD,
    MOUSE,
    CIRCUIT,
    HISTORY,
    tileSize,
    deviceSize,
    SPRITES
};