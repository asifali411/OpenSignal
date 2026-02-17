import Device from "./device";
import { WORLD } from "../main/setup";

class Ground extends Device{
    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, "Ground");
    }
}

export default Ground;