class SOURCE extends __DEVICE__{
    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, "Source");
        this.out = {
            voltage: 0
        }
    }
}

const createSOURCE = () => {
    const source = new SOURCE();
    source.x = WORLD.camera.x;
    source.y = WORLD.camera.y;

    CIRCUIT.devices.push(source);
    HISTORY.saveState();
}

const drawSOURCE = (source) => {
    ctx.drawImage(SPRITES["Source"], source.x, source.y, deviceSize, deviceSize);
    if (source.out.voltage <= 0.2) {
        ctx.fillStyle = 'tomato';
    } else {
        ctx.fillStyle = 'yellowgreen';
    }

    ctx.beginPath();
    ctx.arc(source.x + deviceSize / 2, source.y + deviceSize / 2, deviceSize / 3.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(source.x + deviceSize + 5, source.y + deviceSize / 2, 5, 0, Math.PI * 2);
    ctx.fill();
}

const toggleSOURCE = (source) => {
    if (source.out.voltage <= 0.2) {
        source.out.voltage = 5;
    } else {
        source.out.voltage = 0;
    }
}