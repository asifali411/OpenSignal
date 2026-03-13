import { CIRCUIT, deviceSize, PIN_TYPE, VALUE } from "../../main/setup";
import Pin from "./pin";

import { Source } from "../source";
import Bulb from "../bulb";
import { Switch } from "../switch";
import And from "../gates/and";
import Or from "../gates/or";
import Not from "../gates/not";
import Xor from "../gates/xor";
import Nand from "../gates/nand";
import Nor from "../gates/nor";
import Xnor from "../gates/xnor";

class Create {
    source(): void {
        const s = new Source();
        const outputPin = new Pin(s.id, deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);

        s.outputPins.push(outputPin.id);
        CIRCUIT.pins.set(outputPin.id, outputPin);
        CIRCUIT.devices.set(s.id, s);
    }

    bulb(): void {
        const b = new Bulb();
        const inputPin = new Pin(b.id, 0, deviceSize / 2, PIN_TYPE.INPUT);

        b.inputPins.push(inputPin.id);
        CIRCUIT.pins.set(inputPin.id, inputPin);
        CIRCUIT.devices.set(b.id, b);
    }

    keySwitch(): void {
        const sw   = new Switch();
        const lpin = new Pin(sw.id, 0, deviceSize / 2, PIN_TYPE.INOUT);
        const rpin = new Pin(sw.id, deviceSize, deviceSize / 2, PIN_TYPE.INOUT);

        sw.in_outPins.push(lpin.id, rpin.id);
        CIRCUIT.pins.set(lpin.id, lpin);
        CIRCUIT.pins.set(rpin.id, rpin);
        CIRCUIT.devices.set(sw.id, sw);
    }

    and(): void {
        const gate = new And();
        const A    = new Pin(gate.id, -5, deviceSize / 3,     PIN_TYPE.INPUT);
        const B    = new Pin(gate.id, -5, deviceSize * 2 / 3, PIN_TYPE.INPUT);
        const out  = new Pin(gate.id, deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);

        gate.inputPins.push(A.id, B.id);
        gate.outputPins.push(out.id);
        CIRCUIT.pins.set(A.id, A);
        CIRCUIT.pins.set(B.id, B);
        CIRCUIT.pins.set(out.id, out);
        CIRCUIT.devices.set(gate.id, gate);
    }

    or(): void {
        const gate = new Or();
        const A    = new Pin(gate.id, -5, deviceSize / 3,     PIN_TYPE.INPUT);
        const B    = new Pin(gate.id, -5, deviceSize * 2 / 3, PIN_TYPE.INPUT);
        const out  = new Pin(gate.id, deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);

        gate.inputPins.push(A.id, B.id);
        gate.outputPins.push(out.id);
        CIRCUIT.pins.set(A.id, A);
        CIRCUIT.pins.set(B.id, B);
        CIRCUIT.pins.set(out.id, out);
        CIRCUIT.devices.set(gate.id, gate);
    }

    not(): void {
        const gate   = new Not();
        const input  = new Pin(gate.id, -5, deviceSize / 2, PIN_TYPE.INPUT);
        const output = new Pin(gate.id, deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);

        output.value = VALUE.HIGH;
        gate.inputPins.push(input.id);
        gate.outputPins.push(output.id);
        CIRCUIT.pins.set(input.id, input);
        CIRCUIT.pins.set(output.id, output);
        CIRCUIT.devices.set(gate.id, gate);
    }

    xor(): void {
        const gate = new Xor();
        const A    = new Pin(gate.id, -5, deviceSize / 3,     PIN_TYPE.INPUT);
        const B    = new Pin(gate.id, -5, deviceSize * 2 / 3, PIN_TYPE.INPUT);
        const out  = new Pin(gate.id, deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);

        gate.inputPins.push(A.id, B.id);
        gate.outputPins.push(out.id);
        CIRCUIT.pins.set(A.id, A);
        CIRCUIT.pins.set(B.id, B);
        CIRCUIT.pins.set(out.id, out);
        CIRCUIT.devices.set(gate.id, gate);
    }

    nand(): void {
        const gate = new Nand();
        const A    = new Pin(gate.id, -5, deviceSize / 3,     PIN_TYPE.INPUT);
        const B    = new Pin(gate.id, -5, deviceSize * 2 / 3, PIN_TYPE.INPUT);
        const out  = new Pin(gate.id, deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);

        out.value = VALUE.HIGH;
        gate.inputPins.push(A.id, B.id);
        gate.outputPins.push(out.id);
        CIRCUIT.pins.set(A.id, A);
        CIRCUIT.pins.set(B.id, B);
        CIRCUIT.pins.set(out.id, out);
        CIRCUIT.devices.set(gate.id, gate);
    }

    nor(): void {
        const gate = new Nor();
        const A    = new Pin(gate.id, -5, deviceSize / 3,     PIN_TYPE.INPUT);
        const B    = new Pin(gate.id, -5, deviceSize * 2 / 3, PIN_TYPE.INPUT);
        const out  = new Pin(gate.id, deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);

        out.value = VALUE.HIGH;
        gate.inputPins.push(A.id, B.id);
        gate.outputPins.push(out.id);
        CIRCUIT.pins.set(A.id, A);
        CIRCUIT.pins.set(B.id, B);
        CIRCUIT.pins.set(out.id, out);
        CIRCUIT.devices.set(gate.id, gate);
    }

    xnor(): void {
        const gate = new Xnor();
        const A    = new Pin(gate.id, -5, deviceSize / 3,     PIN_TYPE.INPUT);
        const B    = new Pin(gate.id, -5, deviceSize * 2 / 3, PIN_TYPE.INPUT);
        const out  = new Pin(gate.id, deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);

        out.value = VALUE.HIGH;
        gate.inputPins.push(A.id, B.id);
        gate.outputPins.push(out.id);
        CIRCUIT.pins.set(A.id, A);
        CIRCUIT.pins.set(B.id, B);
        CIRCUIT.pins.set(out.id, out);
        CIRCUIT.devices.set(gate.id, gate);
    }
}

export default Create;