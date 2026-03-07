import { VALUE } from "../../main/setup";
import { getPin } from "../../main/util";
import And from "../gates/and";
import Nand from "../gates/nand";
import Nor from "../gates/nor";
import Not from "../gates/not";
import Or from "../gates/or";
import Xnor from "../gates/xnor";
import Xor from "../gates/xor";

class Update {

    private static setOutput(pin: any, value: VALUE): number {
        if (pin.value !== value) {
            pin.value = value;
            return pin.netID ?? -1;
        }
        return -1;
    }

    static and(device: And): number {
        const A = getPin(device.inputPins[0]);
        const B = getPin(device.inputPins[1]);
        const out = getPin(device.outputPins[0]);

        const result = (A.value === VALUE.HIGH && B.value === VALUE.HIGH)
            ? VALUE.HIGH
            : VALUE.Z;

        return Update.setOutput(out, result);
    }

    static or(device: Or): number {
        const A = getPin(device.inputPins[0]);
        const B = getPin(device.inputPins[1]);
        const out = getPin(device.outputPins[0]);

        const result = (A.value === VALUE.HIGH || B.value === VALUE.HIGH)
            ? VALUE.HIGH
            : VALUE.Z;

        return Update.setOutput(out, result);
    }

    static not(device: Not): number {
        const input = getPin(device.inputPins[0]);
        const out = getPin(device.outputPins[0]);

        const result = (input.value === VALUE.HIGH)
            ? VALUE.Z
            : VALUE.HIGH;

        return Update.setOutput(out, result);
    }

    static xor(device: Xor): number {
        const A = getPin(device.inputPins[0]);
        const B = getPin(device.inputPins[1]);

        const out = getPin(device.outputPins[0]);

        const result = (A.value !== B.value)
            ? VALUE.HIGH
            : VALUE.Z;
        
        return Update.setOutput(out, result);
    }

    static nand(device: Nand): number {
        const A = getPin(device.inputPins[0]);
        const B = getPin(device.inputPins[1]);
        const out = getPin(device.outputPins[0]);

        const result = (A.value === VALUE.HIGH && B.value === VALUE.HIGH)
            ? VALUE.Z
            : VALUE.HIGH;
        return Update.setOutput(out, result);
    }

    static nor(device: Nor): number {
        const A = getPin(device.inputPins[0]);
        const B = getPin(device.inputPins[1]);
        const out = getPin(device.outputPins[0]);

        const result = (A.value === VALUE.HIGH || B.value === VALUE.HIGH)
            ? VALUE.Z
            : VALUE.HIGH;
        return Update.setOutput(out, result);
    }

    static xnor(device: Xnor): number {
        const A = getPin(device.inputPins[0]);
        const B = getPin(device.inputPins[1]);
        const out = getPin(device.outputPins[0]);

        const result = (A.value === B.value)
            ? VALUE.HIGH
            : VALUE.Z;
        return Update.setOutput(out, result);
    }
}

export default Update;