import { DEVICE } from "../main/setup";
import Pin from "./functions/pin";
class Device {
    public offsetX = 0;
    public offsetY = 0;
    public isDragging = false;
    public selected = false;
    public outputPins: Pin[] = [];
    public inputPins: Pin[] = [];
    public id = Date.now() + Math.floor(Math.random() * 1000);

    constructor(
        public x: number,
        public y: number,
        public name: DEVICE
    ) {}
}

export default Device;