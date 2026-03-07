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

        const A = new Pin(andGate.id, -5, deviceSize / 3, PIN_TYPE.INPUT);
        const B = new Pin(andGate.id, -5, deviceSize * 2 / 3, PIN_TYPE.INPUT);

        const out = new Pin(andGate.id, deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);

        andGate.inputPins.push(A.id);
        andGate.inputPins.push(B.id);

        andGate.outputPins.push(out.id);

        CIRCUIT.pins.set(A.id, A);
        CIRCUIT.pins.set(B.id, B);
        CIRCUIT.pins.set(out.id, out);

        CIRCUIT.devices.set(andGate.id, andGate);
    }

    or() {
        const orGate: Or = new Or();

        const A = new Pin(orGate.id, -5, deviceSize / 3, PIN_TYPE.INPUT);
        const B = new Pin(orGate.id, -5, deviceSize * 2 / 3, PIN_TYPE.INPUT);

        const out = new Pin(orGate.id, deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);

        orGate.inputPins.push(A.id);
        orGate.inputPins.push(B.id);

        orGate.outputPins.push(out.id);

        CIRCUIT.pins.set(A.id, A);
        CIRCUIT.pins.set(B.id, B);
        CIRCUIT.pins.set(out.id, out);

        CIRCUIT.devices.set(orGate.id, orGate);
    }

    not() {
        const notGate: Not = new Not();

        const input = new Pin(notGate.id, -5, deviceSize / 2, PIN_TYPE.INPUT);
        const output = new Pin(notGate.id, deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);

        output.value = VALUE.HIGH;

        notGate.inputPins.push(input.id);
        notGate.outputPins.push(output.id);

        CIRCUIT.pins.set(input.id, input);
        CIRCUIT.pins.set(output.id, output);

        CIRCUIT.devices.set(notGate.id, notGate);
    }

    xor() {
        const xorGate: Xor = new Xor();

        
        const A = new Pin(xorGate.id, -5, deviceSize / 3, PIN_TYPE.INPUT);
        const B = new Pin(xorGate.id, -5, deviceSize * 2 / 3, PIN_TYPE.INPUT);

        const out = new Pin(xorGate.id, deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);

        xorGate.inputPins.push(A.id);
        xorGate.inputPins.push(B.id);
        xorGate.outputPins.push(out.id);

        CIRCUIT.pins.set(A.id, A);
        CIRCUIT.pins.set(B.id, B);
        CIRCUIT.pins.set(out.id, out);

        CIRCUIT.devices.set(xorGate.id, xorGate);
    }

    nand() {
        const nandGate: Nand = new Nand();
        const A = new Pin(nandGate.id, -5, deviceSize / 3, PIN_TYPE.INPUT);
        const B = new Pin(nandGate.id, -5, deviceSize * 2 / 3, PIN_TYPE.INPUT);

        const out = new Pin(nandGate.id, deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);
        out.value = VALUE.HIGH;

        nandGate.inputPins.push(A.id);
        nandGate.inputPins.push(B.id);
        nandGate.outputPins.push(out.id);

        CIRCUIT.pins.set(A.id, A);
        CIRCUIT.pins.set(B.id, B);
        CIRCUIT.pins.set(out.id, out);

        CIRCUIT.devices.set(nandGate.id, nandGate);
    }

    nor() {
        const norGate: Nor = new Nor();
        const A = new Pin(norGate.id, -5, deviceSize / 3, PIN_TYPE.INPUT);
        const B = new Pin(norGate.id, -5, deviceSize * 2 / 3, PIN_TYPE.INPUT);

        const out = new Pin(norGate.id, deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);
        out.value = VALUE.HIGH;

        norGate.inputPins.push(A.id);
        norGate.inputPins.push(B.id);
        norGate.outputPins.push(out.id);

        CIRCUIT.pins.set(A.id, A);
        CIRCUIT.pins.set(B.id, B);
        CIRCUIT.pins.set(out.id, out);

        CIRCUIT.devices.set(norGate.id, norGate);
    }

    xnor() {
        const xnorGate: Xnor = new Xnor();
        const A = new Pin(xnorGate.id, -5, deviceSize / 3, PIN_TYPE.INPUT);
        const B = new Pin(xnorGate.id, -5, deviceSize * 2 / 3, PIN_TYPE.INPUT);

        const out = new Pin(xnorGate.id, deviceSize + 5, deviceSize / 2, PIN_TYPE.OUTPUT);
        out.value = VALUE.HIGH;

        xnorGate.inputPins.push(A.id);
        xnorGate.inputPins.push(B.id);
        xnorGate.outputPins.push(out.id);

        CIRCUIT.pins.set(A.id, A);
        CIRCUIT.pins.set(B.id, B);
        CIRCUIT.pins.set(out.id, out);

        CIRCUIT.devices.set(xnorGate.id, xnorGate);
    }
}

export default Create;