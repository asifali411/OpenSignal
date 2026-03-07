import { DEVICE, WORLD } from "../../main/setup";
import Gate from "../gate";

class Nor extends Gate{
    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, DEVICE.NOR);
    }
}

export default Nor;