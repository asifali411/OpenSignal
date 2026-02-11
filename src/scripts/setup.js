const DeviceBar = document.querySelector('.device-bar');
const extraDeviceDialog = document.querySelector('.extra-devices-dialog');
const extraDevices = document.querySelector('.extra-devices');
const overlay = document.querySelector('.overlay');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const tileSize = 30;

const PAN = "pan";
const EDIT = "edit";

const EXTRA_DEVICES = "extra Devices";

const DEVICES = [
    {
        device: "Source",
        img: "../src/assets/source.png"
    },
    {
        device: "Ground",
        img: "../src/assets/ground.png"
    },
    {
        device: "Bulb",
        img: "../src/assets/bulb.png"
    },
    {
        Device: "Cell",
        img: "../src/assets/cell.png"
    },
    {
        device: "Switch",
        img: "../src/assets/switch.png"
    },
    {
        device: "Resistor",
        img: "../src/assets/resistor.png"
    },
    {
        device: "AND Gate",
        img: "../src/assets/andGate.png"
    },
    {
        device: "OR Gate",
        img: "../src/assets/orGate.png"
    },
    {
        device: "NOT Gate",
        img: "../src/assets/notGate.png"
    },
    {
        device: "XOR Gate",
        img: "../src/assets/xorGate.png"
    },
    {
        device: "NAND Gate",
        img: "../src/assets/nandGate.png"
    },
    {
        device: "NOR Gate",
        img: "../src/assets/norGate.png"
    },
    {
        device: "XNOR Gate",
        img: "../src/assets/xnorGate.png"
    }
];

const WORLD = {
    mode: EDIT,
    camera: {
        x: 0,
        y: 0,
        lastX: 0,
        lastY: 0,
        zoom: 1
    },
    dialog: {
        box: EXTRA_DEVICES,
        show: false
    }
};

const MOUSE = {
    x: 0,
    y: 0,
};