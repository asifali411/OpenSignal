import { VALUE } from "../../main/setup";
import { getPin } from "../../main/util";
import And from "../gates/and";
import Not from "../gates/not";

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

    static or(device: And): number {
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
}

export default Update;