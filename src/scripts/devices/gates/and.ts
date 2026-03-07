import { DEVICE, WORLD } from "../../main/setup";
import Gate from "../gate";

class And extends Gate {
    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, DEVICE.AND);
    }
}

export default And;