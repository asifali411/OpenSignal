import Pin from "./functions/pin";
class Device {
    public offsetX = 0;
    public offsetY = 0;
    public isDragging = false;
    public selected = false;
    public outputPins: Pin[] = [];
    public inputPins: Pin[] = [];

    constructor(
        public x: number,
        public y: number,
        public name: string
    ) {}
}

export default Device;