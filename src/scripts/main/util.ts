import Device from "../devices/device";
import Pin from "../devices/functions/pin";
import { canvas, ctx } from "./reference";
import { tileSize, deviceSize, WORLD, MOUSE } from "./setup";

const resizeCanvas = () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
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

type POINT = {
    x: number,
    y: number
}
const toWorld = (x: number, y: number): POINT => {
    return {
        x: (x - canvas.width / 2) / WORLD.camera.zoom + WORLD.camera.x,
        y: (y - canvas.height / 2) / WORLD.camera.zoom + WORLD.camera.y
    };
}

const isHovering = (device: Device): boolean => {
    return (MOUSE.x >= device.x && MOUSE.x <= device.x + deviceSize && MOUSE.y >= device.y && MOUSE.y <= device.y + deviceSize);
}

const isHoveringPin = (pin: Pin): boolean => {
    const dx = MOUSE.x - pin.x;
    const dy = MOUSE.y - pin.y;

    return Math.hypot(dx, dy) <= 5;
}

export {
    resizeCanvas,
    createGrid,
    toWorld,
    isHovering,
    isHoveringPin
}