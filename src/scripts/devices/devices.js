class __DEVICE__ {
    constructor(x, y, name) {
        this.x = x;
        this.y = y;
        this.name = name;

        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
    }
}

const SPRITES = {};

DEVICES.forEach(device => {
    SPRITES[device.device] = new Image();
    SPRITES[device.device].src = device.img;
});

const isHovering = (device) => {
    return (MOUSE.x >= device.x && MOUSE.x <= device.x + deviceSize && MOUSE.y >= device.y && MOUSE.y <= device.y + deviceSize);
}

const drawDEVICES = () => {
    CIRCUIT.devices.forEach(device => {
        switch(device.name){
            case 'Source':
                drawSOURCE(device);
                break;
            case 'Ground':
                drawGROUND(device);
                break;
            default:
                break;
        }
    });
}