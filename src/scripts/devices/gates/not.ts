import { DEVICE, WORLD } from "../../main/setup";
import Gate from "../gate";

class Not extends Gate{
    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, DEVICE.NOT);
    }
}

export default Not;