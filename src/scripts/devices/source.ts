import Device from "./device";
import { CIRCUIT, DEVICE, SOLVER, VALUE, WORLD } from "../main/setup";
import { getPin } from "../main/util";
import Pin from "./functions/pin";

class Source extends Device {

    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, DEVICE.SOURCE);
    }
}

const toggleSource = (source: Source) => {
    const pin = getPin(source.outputPins[0]);
    const pinValue = pin.value === VALUE.HIGH ? VALUE.Z : VALUE.HIGH;
    Pin.setValue(pin, pinValue);
    if (pin.netID == null) return;
    SOLVER.SolveCircuit(CIRCUIT.nets.get(pin.netID)!);
}

export { Source, toggleSource };