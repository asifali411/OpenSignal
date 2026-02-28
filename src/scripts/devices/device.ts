import { DEVICE } from "../main/setup";

let deviceID = 0;
class Device {
    public offsetX = 0;
    public offsetY = 0;
    public isDragging = false;
    public selected = false;
    public outputPins: number[] = [];
    public inputPins: number[] = [];
    public id = deviceID++;

    constructor(
        public x: number,
        public y: number,
        public name: DEVICE
    ) {}
}

export default Device;