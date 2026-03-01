import { CIRCUIT, DEVICE, SOLVER, WORLD } from "../main/setup";
import Device from "./device";
import { combineNets, splitNets } from "../../solver/net";

class Switch extends Device {

    public ON: boolean;

    constructor() {
        super(WORLD.camera.x, WORLD.camera.y, DEVICE.SWITCH);
        this.ON = false;
    }
}

const updateSwitch = (device: Switch) => {
    const lpin = CIRCUIT.pins.get(device.in_outPins[0]);
    const rpin = CIRCUIT.pins.get(device.in_outPins[1]);

    if (!lpin || !rpin) return;


    if (device.ON) {
        if (lpin.netID !== null && rpin.netID !== null && lpin.netID !== rpin.netID) {
            combineNets(lpin, rpin);
        }
    
        if (lpin.netID !== null)
            SOLVER.Solve(CIRCUIT.nets.get(lpin.netID)!);
    
    } else {
        if (lpin.netID !== null && rpin.netID !== null && lpin.netID === rpin.netID) {
            splitNets(lpin, rpin);
    
            if (lpin.netID !== null)
                SOLVER.Solve(CIRCUIT.nets.get(lpin.netID)!);
    
            if (rpin.netID !== null && rpin.netID !== lpin.netID)
                SOLVER.Solve(CIRCUIT.nets.get(rpin.netID)!);
        }
    }
}

const toggleSwitch = (device: Switch) => {
    device.ON = !device.ON;

    updateSwitch(device);
}

export { Switch, toggleSwitch };