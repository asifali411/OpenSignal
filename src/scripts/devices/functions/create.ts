import { CIRCUIT, deviceSize, PIN_TYPE } from "../../main/setup";
import Pin from "./pin";

import { Source } from "../source";
import Bulb from "../bulb";

class Create {
    source() {
        const s: Source = new Source();

        const outputPin = new Pin(s.id,  deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);

        s.outputPins.push(outputPin.id);
        CIRCUIT.pins.set(outputPin.id, outputPin);
        CIRCUIT.devices.set(s.id, s);
    }

    bulb() {
        const b: Bulb = new Bulb();

        const inputPin = new Pin(b.id, 0, deviceSize / 2, PIN_TYPE.INPUT);

        b.inputPins.push(inputPin.id);
        CIRCUIT.pins.set(inputPin.id, inputPin);
        CIRCUIT.devices.set(b.id, b);
    }
}

export default Create;