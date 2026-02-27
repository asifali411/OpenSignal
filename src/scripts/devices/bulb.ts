import Device from "./device";
import { DEVICE, WORLD } from "../main/setup";

class Bulb extends Device {
    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, DEVICE.BULB);
    }
}

export default Bulb;