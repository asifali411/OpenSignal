import { CIRCUIT, deviceSize } from "../../main/setup";
import Pin from "./pin";

import { Source } from "../source";
import Bulb from "../bulb";

class Create {
    source() {
        const s: Source = new Source();

        const outputPin = new Pin(s, deviceSize + 5, deviceSize / 2);

        s.outputPins.push(outputPin);

        CIRCUIT.devices.push(s);
    }

    bulb() {
        const b: Bulb = new Bulb();

        const inputPin = new Pin(b, 0, deviceSize / 2);

        b.inputPins.push(inputPin);

        CIRCUIT.devices.push(b);
    }
}

export default Create;