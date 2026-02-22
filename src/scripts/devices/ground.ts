import Device from "./device";
import { WORLD } from "../main/setup";

interface Out {
    voltage: number
}

class Ground extends Device{

    public out: Out;

    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, "Ground");
        this.out = {
            voltage: 0
        }
    }
}

export default Ground;