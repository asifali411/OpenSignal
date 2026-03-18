import Device from "../devices/device";
import Pin from "../devices/functions/pin";
import { canvas, ctx } from "./reference";
import { tileSize, deviceSize, WORLD, MOUSE, CIRCUIT, gridSize } from "./setup";

const resizeCanvas = (): void => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
};

const createGrid = (): void => {
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = '#444';

    ctx.beginPath();
    for (let x = -canvas.width * 10; x < canvas.width * 10; x += tileSize) {
        ctx.moveTo(x, -canvas.height * 10);
        ctx.lineTo(x, canvas.height * 10);
    }
    for (let y = -canvas.height * 10; y < canvas.height * 10; y += tileSize) {
        ctx.moveTo(-canvas.width * 10, y);
        ctx.lineTo(canvas.width * 10, y);
    }
    ctx.stroke();

    ctx.globalAlpha = 1;
};

type Point = {
    x: number;
    y: number;
};

const toWorld = (x: number, y: number): Point => {
    return {
        x: (x - canvas.width / 2) / WORLD.camera.zoom + WORLD.camera.x,
        y: (y - canvas.height / 2) / WORLD.camera.zoom + WORLD.camera.y,
    };
};

const toScreen = (x: number, y: number): Point => {
    return {
        x: (x - WORLD.camera.x) * WORLD.camera.zoom + canvas.width / 2,
        y: (y - WORLD.camera.y) * WORLD.camera.zoom + canvas.height / 2,
    };
};

const isHovering = (device: Device): boolean => {
    return (
        MOUSE.x >= device.x &&
        MOUSE.x <= device.x + deviceSize &&
        MOUSE.y >= device.y &&
        MOUSE.y <= device.y + deviceSize
    );
};

const isHoveringPin = (pin: Pin): boolean => {
    const device = getDevice(pin.deviceID);
    const dx = MOUSE.x - (pin.offsetX + device.x);
    const dy = MOUSE.y - (pin.offsetY + device.y);
    return Math.hypot(dx, dy) <= 5;
};

const getPin = (pinID: number): Pin => {
    return CIRCUIT.pins.get(pinID)!;
};

const getDevice = (deviceID: number): Device => {
    return CIRCUIT.devices.get(deviceID)!;
};

const getPinX = (pin: Pin): number => {
    return getDevice(pin.deviceID).x + pin.offsetX;
};

const getPinY = (pin: Pin): number => {
    return getDevice(pin.deviceID).y + pin.offsetY;
};

const getDeviceGridKey = (device: Device, offsetX = 0, offsetY = 0): string => {
   return `${Math.floor(device.x / gridSize) + offsetX}-${Math.floor(device.y / gridSize) + offsetY}`;
}

const getPinGridKey = (pin: Pin, offsetX = 0, offsetY = 0): string => {
    return `${Math.floor(getPinX(pin) / gridSize) + offsetX}-${Math.floor(getPinY(pin) / gridSize) + offsetY}`;
}

export {
    resizeCanvas,
    createGrid,
    toWorld,
    toScreen,
    isHovering,
    isHoveringPin,
    getPin,
    getDevice,
    getPinX,
    getPinY,
    getDeviceGridKey,
    getPinGridKey,
};

export type { Point };