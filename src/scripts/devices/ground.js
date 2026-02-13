class GROUND extends __DEVICE__{
    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, "Ground");
    }
}

const createGROUND = () => {
    const ground = new GROUND();
    ground.x = WORLD.camera.x;
    ground.y = WORLD.camera.y;

    CIRCUIT.devices.push(ground);
    HISTORY.saveState();
}

const drawGROUND = (device) => {
    ctx.drawImage(SPRITES["Ground"], device.x, device.y, deviceSize, deviceSize);
}