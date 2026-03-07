import { DEVICE, WORLD } from "../../main/setup";
import Gate from "../gate";

class Xor extends Gate{
    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, DEVICE.XOR);
    }
}

export default Xor;