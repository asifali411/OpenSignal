import { CIRCUIT, WORLD, deviceSize } from "../../main/setup";
import Pin from "./pin";

import { Source } from "../source";
import Ground from "../ground";

class Create {
    source() {
        const s: Source = new Source();
        s.x = WORLD.camera.x;
        s.y = WORLD.camera.y;

        const outputPin = new Pin(s, deviceSize + 5, deviceSize / 2);

        s.outputPins.push(outputPin);

        CIRCUIT.devices.push(s);
    }

    ground() {
        const g: Ground = new Ground();
        g.x = WORLD.camera.x;
        g.y = WORLD.camera.y;

        const outputPin = new Pin(g, deviceSize / 2, -5);

        g.outputPins.push(outputPin);

        CIRCUIT.devices.push(g);
    }
}

export default Create;