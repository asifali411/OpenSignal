import Pin from "../scripts/devices/functions/pin";
import { CIRCUIT, VALUE } from "../scripts/main/setup";
import { getPin } from "../scripts/main/util";

let netID = 0;

export function setNetID (newID: number) {
    netID = newID;
}

class Net {
    public pins: Set<Pin> = new Set(); // TODO: pins should only store the id not the entire pin
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

const splitNets = (pinA: Pin, pinB: Pin): void => {

    if (pinA.netID === null || pinB.netID === null) return;
    if (pinA.netID !== pinB.netID) return;

    const oldNetID = pinA.netID;
    const oldNet = CIRCUIT.nets.get(oldNetID);
    if (!oldNet) return;

    pinA.connectedPins.delete(pinB.id);
    pinB.connectedPins.delete(pinA.id);

    const pins = Array.from(oldNet.pins);

    CIRCUIT.nets.delete(oldNetID);

    const visited = new Set<number>();

    for (const startPin of pins) {

        if (visited.has(startPin.id)) continue;

        const newNet = new Net();
        CIRCUIT.nets.set(newNet.id, newNet);

        const queue: Pin[] = [startPin];
        visited.add(startPin.id);

        while (queue.length > 0) {
            const current = queue.shift()!;

            addToNet(current, newNet);

            for (const neighborID of current.connectedPins) {
                const neighbor = getPin(neighborID);

                if (
                    neighbor.netID === oldNetID &&
                    !visited.has(neighbor.id)
                ) {
                    visited.add(neighbor.id);
                    queue.push(neighbor);
                }
            }
        }
    }
};
export {
    Net,
    addToNet,
    removeFromNet,
    combineNets,
    splitNets
};