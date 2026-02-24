import Device from "./device";
import { DEVICE, WORLD } from "../main/setup";

class Ground extends Device{

    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, DEVICE.GROUND);
    }
}

export default Ground;