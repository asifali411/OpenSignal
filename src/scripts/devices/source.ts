class Source extends Device{
    
    public out: any;
    
    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, "Source");
        this.out = {
            voltage: 0
        }
    }
}

const createSource = () => {
    const source: Source = new Source();
    source.x = WORLD.camera.x;
    source.y = WORLD.camera.y;

    CIRCUIT.devices.push(source);
}

const toggleSOURCE = (source: Source) => {
    if (source.out.voltage <= 0.2) {
        source.out.voltage = 5;
    } else {
        source.out.voltage = 0;
    }
}