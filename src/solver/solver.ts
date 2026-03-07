import Pin from "../scripts/devices/functions/pin";
import { updateDevice } from "../scripts/main/script";
import { CIRCUIT, maxDelta, PIN_TYPE, VALUE } from "../scripts/main/setup";
import { getDevice } from "../scripts/main/util";
import { Net } from "./net";

interface Queue {
    devices: number[];
    nets: number[];
}

class Solver {

    private queue: Queue = {
        devices: [],
        nets: []
    };

    private deviceSet = new Set<number>();
    private netSet = new Set<number>();

    private scheduleDevice(id: number) {
        if (this.deviceSet.has(id)) return;
        this.deviceSet.add(id);
        this.queue.devices.push(id);
    }

    private scheduleNet(id: number) {
        if (this.netSet.has(id)) return;
        this.netSet.add(id);
        this.queue.nets.push(id);
    }

    private clearDevice(id: number) {
        this.deviceSet.delete(id);
    }

    private clearNet(id: number) {
        this.netSet.delete(id);
    }

    Solve(net: Net) {
        let resolvedValue = VALUE.Z;
        let hasDrivenValue = false;

        for (const pin of net.pins) {

            if (pin.type === PIN_TYPE.INPUT || pin.type === PIN_TYPE.INOUT) continue;

            if (pin.value === VALUE.Z) continue;

            if (pin.value === VALUE.X) {
                resolvedValue = VALUE.X;
                break;
            }

            if (!hasDrivenValue) {
                resolvedValue = pin.value;
                hasDrivenValue = true;
            }
            else if (resolvedValue !== pin.value) {
                resolvedValue = VALUE.X;
                break;
            }
        }

        for (const pin of net.pins) {

            if (pin.type === PIN_TYPE.INPUT || pin.type === PIN_TYPE.INOUT) {

                if (pin.value === resolvedValue) continue;

                Pin.setValue(pin, resolvedValue);
                this.scheduleDevice(pin.deviceID);
            }
        }
    }

    SolveCircuit(startingNet: Net) {

        this.queue.nets = [];
        this.queue.devices = [];
        this.netSet.clear();
        this.deviceSet.clear();

        this.scheduleNet(startingNet.id);

        let delta = 0;

        while (this.queue.nets.length > 0) {

            const netID = this.queue.nets.pop()!;
            this.clearNet(netID);

            const net = CIRCUIT.nets.get(netID);
            if (!net) continue;

            this.Solve(net);

            while (this.queue.devices.length > 0) {

                const deviceID = this.queue.devices.pop()!;
                this.clearDevice(deviceID);

                const changedNets = updateDevice(getDevice(deviceID));

                if (!changedNets) continue;

                const nets = Array.isArray(changedNets)
                    ? changedNets
                    : [changedNets];

                for (const id of nets) {
                    if (id < 0) continue;
                    this.scheduleNet(id);
                }
            }

            delta++;

            if (delta > maxDelta) {
                this.handleOscillation();
                break;
            }
        }
    }

    private handleOscillation() {

        while (this.queue.nets.length > 0) {

            const netID = this.queue.nets.pop()!;
            const net = CIRCUIT.nets.get(netID);
            if (!net) continue;

            for (const pin of net.pins) {

                if (pin.value === VALUE.X) continue;

                if (pin.type === PIN_TYPE.INPUT || pin.type === PIN_TYPE.INOUT) {
                    Pin.setValue(pin, VALUE.X);
                }
            }
        }
    }
}

export default Solver;