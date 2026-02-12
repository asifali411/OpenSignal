class __DEVICE__ {
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
    }

    draw() {
        ctx.drawImage(this.sprite, this.x, this.y, deviceSize, deviceSize);
    }

    isHovering(){
        return (MOUSE.x >= this.x && MOUSE.x <= this.x + deviceSize && MOUSE.y >= this.y && MOUSE.y <= this.y + deviceSize);
    }
}

const SPRITES = {};

DEVICES.forEach(device => {
    SPRITES[device.device] = new Image();
    SPRITES[device.device].src = device.img;
});