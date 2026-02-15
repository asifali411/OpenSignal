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

const SPRITES: any = {};

DEVICES.forEach(device => {
    SPRITES[device.name] = new Image();
    SPRITES[device.name].src = device.img;
});

const DRAW = new Draw();

const drawDEVICES = () => {
    CIRCUIT.devices.forEach((device: any) => {
        switch(device.name){
            case 'Source':
                DRAW.source(device);
                break;
            case 'Ground':
                DRAW.ground(device);
                break;
            default:
                break;
        }
    });
}