import { DEVICE, WORLD } from "../../main/setup";
import Gate from "../gate";

class Nand extends Gate{
    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, DEVICE.NAND);
    }
}

export default Nand;