import { DEVICE, WORLD } from "../../main/setup";
import Gate from "../gate";

class Or extends Gate {
    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, DEVICE.OR);
    }
}

export default Or;