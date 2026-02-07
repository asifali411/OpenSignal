const toolBar = document.querySelector('.tool-bar');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const tileSize = 30;

const PAN = "pan";
const EDIT = "edit";

const TOOLS = [
    {
        tool: "Source",
        img: "../src/assets/source.png"
    },
    {
        tool: "Ground",
        img: "../src/assets/ground.png"
    },
    {
        tool: "Bulb",
        img: "../src/assets/bulb.png"
    },
    {
        tool: "Cell",
        img: "../src/assets/cell.png"
    },
    {
        tool: "Switch",
        img: "../src/assets/switch.png"
    },
    {
        tool: "Resistor",
        img: "../src/assets/resistor.png"
    },
    {
        tool: "AND Gate",
        img: "../src/assets/andGate.png"
    },
    {
        tool: "OR Gate",
        img: "../src/assets/orGate.png"
    },
    {
        tool: "NOT Gate",
        img: "../src/assets/notGate.png"
    },
    {
        tool: "XOR Gate",
        img: "../src/assets/xorGate.png"
    },
    {
        tool: "NAND Gate",
        img: "../src/assets/nandGate.png"
    },
    {
        tool: "NOR Gate",
        img: "../src/assets/norGate.png"
    },
    {
        tool: "XNOR Gate",
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
    }
};

const MOUSE = {
    x: 0,
    y: 0,
}

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
const createGrid = () => {
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = '#444';

    for(let x = -canvas.width * 10; x < canvas.width * 10; x+=tileSize){
        ctx.moveTo(x, -canvas.height * 10);
        ctx.lineTo(x, canvas.height * 10);
    }
    for (let y = -canvas.height * 10; y < canvas.height * 10; y += tileSize) {
        ctx.moveTo(-canvas.width * 10, y);
        ctx.lineTo(canvas.width * 10, y);
    }

    ctx.stroke();
    ctx.globalAlpha = 1;
}
const createToolBar = () => {
    for(let i = 0; i < TOOLS.length; i++){
        toolBar.innerHTML += `
            <div class="tool" title="${TOOLS[i].tool}" idx="${i + 1}">
            <img src="${TOOLS[i].img}">
            </div>
        `;
    }
}
const toWorld = (x, y) => {
    return {
        x: (x - canvas.width/2) / WORLD.camera.zoom + WORLD.camera.x,
        y: (y - canvas.height/2) / WORLD.camera.zoom + WORLD.camera.y,
    }
}