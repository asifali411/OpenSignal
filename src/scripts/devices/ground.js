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

const drawGROUND = (ground) => {
    ctx.drawImage(SPRITES["Ground"], ground.x, ground.y, deviceSize, deviceSize);

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(ground.x + deviceSize/2, ground.y, 5, 0, Math.PI * 2);
    ctx.fill();
}