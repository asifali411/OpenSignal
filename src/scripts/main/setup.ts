const deviceBar = document.querySelector<HTMLDivElement>('.device-bar')!;
const extraDeviceDialog = document.querySelector<HTMLDivElement>('.extra-devices-dialog')!;
const extraDevices = document.querySelector<HTMLDivElement>('.extra-devices')!;
const overlay = document.querySelector<HTMLDivElement>('.overlay')!;
const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
const ctx = canvas.getContext('2d')!;

const tileSize: number = 30;
const deviceSize: number = 50;

const BUTTONS = {
    undo: document.querySelector<HTMLButtonElement>('.undo')!,
    redo: document.querySelector<HTMLButtonElement>('.redo')!,
    pan: document.querySelector<HTMLButtonElement>('.pan')!,
    edit: document.querySelector<HTMLButtonElement>('.edit')!,
};

enum MODE {
    PAN,
    EDIT
};

const DEVICES = [
    {
        name: "Source",
        img: "./src/assets/source.png",
        click: () => { 
            createSource();
        }
    },
    {
        name: "Ground",
        img: "./src/assets/ground.png",
        click: () => { 
            createGround();
        }
    },
    {
        name: "Bulb",
        img: "../src/assets/bulb.png",
        click: () => { 
            
        }
    },
    {
        name: "Cell",
        img: "../src/assets/cell.png",
        click: () => { 
            
        }
    },
    {
        name: "Switch",
        img: "../src/assets/switch.png",
        click: () => { 
            
        }
    },
    {
        name: "Resistor",
        img: "../src/assets/resistor.png",
        click: () => { 
            
        }
    },
    {
        name: "AND Gate",
        img: "../src/assets/andGate.png",
        click: () => { 
            
        }
    },
    {
        name: "OR Gate",
        img: "../src/assets/orGate.png",
        click: () => { 
            
        }
    },
    {
        name: "NOT Gate",
        img: "../src/assets/notGate.png",
        click: () => { 
            
        }
    },
    {
        name: "XOR Gate",
        img: "../src/assets/xorGate.png",
        click: () => { 
            
        }
    },
    {
        name: "NAND Gate",
        img: "../src/assets/nandGate.png",
        click: () => { 
            
        }
    },
    {
        name: "NOR Gate",
        img: "../src/assets/norGate.png",
        click: () => { 
            
        }
    },
    {
        name: "XNOR Gate",
        img: "../src/assets/xnorGate.png",
        click: () => { 
            
        }
    }
];

interface World {
    mode: MODE,
    movingDevice: any;
    camera: any,
    dialog: any
}

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

const HISTORY = new HistoryManager();
HISTORY.saveState();