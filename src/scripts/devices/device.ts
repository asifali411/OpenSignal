class Device {
    public offsetX = 0;
    public offsetY = 0;
    public isDragging = false;

    constructor(
        public x: number,
        public y: number,
        public name: string
    ) {}
}

export default Device;