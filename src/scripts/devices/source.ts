import Device from "./device";
import { CIRCUIT, DEVICE, SOLVER, VALUE, WORLD } from "../main/setup";
import { getPin } from "../main/util";

class Source extends Device {

    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, DEVICE.SOURCE);
    }
}

const toggleSource = (source: Source) => {
    CIRCUIT.pins.get(source.outputPins[0])!.value = CIRCUIT.pins.get(source.outputPins[0])!.value === VALUE.HIGH ? VALUE.Z : VALUE.HIGH;
    const pin = getPin(source.outputPins[0]);
    if (pin.netID == null) return;
    SOLVER.Solve(CIRCUIT.nets.get(pin.netID)!);
}

export { Source, toggleSource };