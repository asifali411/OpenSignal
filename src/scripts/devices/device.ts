import { DEVICE } from "../main/setup";

let deviceID = 0;

export function setDeviceID (newID: number) {
    deviceID = newID;
}

class Device {
    public offsetX = 0;
    public offsetY = 0;
    public isDragging = false;
    public selected = false;
    public outputPins: number[] = [];
    public inputPins: number[] = [];
    public in_outPins: number[] = [];
    public id = deviceID++;

    constructor(
        public x: number,
        public y: number,
        public name: DEVICE
    ) {}
}

export default Device;