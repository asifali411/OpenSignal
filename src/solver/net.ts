import Pin from "../scripts/devices/functions/pin";
import { CIRCUIT, VALUE } from "../scripts/main/setup";

let netID = 0;

class Net {
    public pins: Set<Pin> = new Set();
    public value = VALUE.LOW;
    public id: number;

    constructor() {
        this.id = netID++;
    }
}

const addToNet = (pin: Pin, net: Net): void => {
    net.pins.add(pin);
    pin.netID = net.id;
}

const removeFromNet = (pin: Pin, net: Net): void => {
    if (!net.pins.has(pin)) return;
    net.pins.delete(pin);
}

const combineNets = (pinA: Pin, pinB: Pin): void => {
    
    if (pinA.netID === null) {
        console.error(`net id of pin: ${pinA.id} is null`);
        return;
    }
    if (pinB.netID === null) {
        console.error(`net id of pin: ${pinB.id} is null`);
        return;
    }
    
    const netA = CIRCUIT.nets.get(pinA.netID)!;
    const netB = CIRCUIT.nets.get(pinB.netID)!;

    for (const p of netB.pins) {
        p.netID = netA.id;
        netA.pins.add(p);
    }

    CIRCUIT.nets.delete(netB.id);
}

export {
    Net,
    addToNet,
    removeFromNet,
    combineNets
};