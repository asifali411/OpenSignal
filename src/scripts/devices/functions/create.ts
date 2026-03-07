import { CIRCUIT, deviceSize, PIN_TYPE } from "../../main/setup";
import Pin from "./pin";

import { Source } from "../source";
import Bulb from "../bulb";
import { Switch } from "../switch";
import And from "../gates/and";
import Or from "../gates/or";
import Not from "../gates/not";

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

    and() {
        const andGate: And = new And();

        const Apin = new Pin(andGate.id, -5, deviceSize / 3, PIN_TYPE.INPUT);
        const Bpin = new Pin(andGate.id, -5, deviceSize * 2 / 3, PIN_TYPE.INPUT);

        const Opin = new Pin(andGate.id, deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);

        andGate.inputPins.push(Apin.id);
        andGate.inputPins.push(Bpin.id);

        andGate.outputPins.push(Opin.id);

        CIRCUIT.pins.set(Apin.id, Apin);
        CIRCUIT.pins.set(Bpin.id, Bpin);
        CIRCUIT.pins.set(Opin.id, Opin);

        CIRCUIT.devices.set(andGate.id, andGate);
    }

    or() {
        const orGate: Or = new Or();

        const Apin = new Pin(orGate.id, -5, deviceSize / 3, PIN_TYPE.INPUT);
        const Bpin = new Pin(orGate.id, -5, deviceSize * 2 / 3, PIN_TYPE.INPUT);

        const Opin = new Pin(orGate.id, deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);

        orGate.inputPins.push(Apin.id);
        orGate.inputPins.push(Bpin.id);

        orGate.outputPins.push(Opin.id);

        CIRCUIT.pins.set(Apin.id, Apin);
        CIRCUIT.pins.set(Bpin.id, Bpin);
        CIRCUIT.pins.set(Opin.id, Opin);

        CIRCUIT.devices.set(orGate.id, orGate);
    }

    not() {
        const notGate: Not = new Not();

        const Ipin = new Pin(notGate.id, -5, deviceSize / 2, PIN_TYPE.OUTPUT);
        const Opin = new Pin(notGate.id, deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);

        notGate.inputPins.push(Ipin.id);
        notGate.outputPins.push(Opin.id);

        CIRCUIT.pins.set(Opin.id, Opin);
        CIRCUIT.pins.set(Ipin.id, Ipin);

        CIRCUIT.devices.set(notGate.id, notGate);
    }
}

export default Create;