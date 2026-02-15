class Ground extends Device{
    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, "Ground");
    }
}

const createGround = () => {
    const ground: Ground = new Ground();
    ground.x = WORLD.camera.x;
    ground.y = WORLD.camera.y;

    CIRCUIT.devices.push(ground);
    HISTORY.saveState();
}