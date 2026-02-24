import Device from "./device";
import { DEVICE, WORLD } from "../main/setup";

class Source extends Device {

    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, DEVICE.SOURCE);
    }
}

const toggleSource = (source: Source) => {
    source.outputPins[0].value = source.outputPins[0].value === 0 ? 1 : 0;
}

export { Source, toggleSource };