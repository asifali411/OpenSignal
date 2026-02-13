class SOURCE extends __DEVICE__{
    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, "Source");
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
}