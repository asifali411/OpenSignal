import { CIRCUIT, deviceSize, PIN_TYPE } from "../../main/setup";
import Pin from "./pin";

import { Source } from "../source";
import Bulb from "../bulb";
import { Switch } from "../switch";

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

    keySwitch() {
        const sw: Switch = new Switch();

        const lpin = new Pin(sw.id, 0, deviceSize / 2, PIN_TYPE.INOUT);
        const rpin = new Pin(sw.id, deviceSize, deviceSize / 2, PIN_TYPE.INOUT);

        sw.in_outPins.push(lpin.id);
        sw.in_outPins.push(rpin.id);

        CIRCUIT.pins.set(lpin.id, lpin);
        CIRCUIT.pins.set(rpin.id, rpin);
        CIRCUIT.devices.set(sw.id, sw);
    }
}

export default Create;