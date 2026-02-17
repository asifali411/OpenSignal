import { CIRCUIT, WORLD } from "../main/setup";

import Source from "./source";
import Ground from "./ground";

class Create {
    source() {
        const s: Source = new Source();
        s.x = WORLD.camera.x;
        s.y = WORLD.camera.y;

        CIRCUIT.devices.push(s);
    }

    ground() {
        const g: Ground = new Ground();
        g.x = WORLD.camera.x;
        g.y = WORLD.camera.y;

        CIRCUIT.devices.push(g);
    }
}

export default Create;