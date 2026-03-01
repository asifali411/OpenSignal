import { PIN_TYPE, VALUE } from "../scripts/main/setup";
import { Net } from "./net";

/*

SELF NOTE:
-> currently the solver only solves a single Net
-> after solving a Net we should trigger the updation of devices having input pins attached to our Net
    net -> pin [INPUT] -> device (update)
-> after updating each device each of their output pins trigger the solver to solve a new set of Net's
    thus propogating the signal throughout the circuit.
*/
class Solver {

    Solve(net: Net) {
        let resolvedValue = VALUE.Z;
        let hasDrivenValue = false;

        for (const pin of net.pins) {
            if (pin.type !== PIN_TYPE.OUTPUT) continue;

            if (pin.value === VALUE.Z) continue;

            if (pin.value === VALUE.X) {
                resolvedValue = VALUE.X;
                break;
            }

            if (!hasDrivenValue) {
                resolvedValue = pin.value;
                hasDrivenValue = true;
            } else if (resolvedValue !== pin.value) {
                resolvedValue = VALUE.X;
                break;
            }
        }

        for (const pin of net.pins) {
            if (pin.type === PIN_TYPE.INPUT || pin.type === PIN_TYPE.INOUT) {
                pin.value = resolvedValue;
            }
        }
    }
}

export default Solver;