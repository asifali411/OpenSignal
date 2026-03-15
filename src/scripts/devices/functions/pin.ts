import { PIN_TYPE, VALUE } from "../../main/setup";
import { getPin } from "../../main/util";

let pinID = 0;

export function setPinID (newID: number) {
    pinID = newID;
}

class Pin {
    public id: number;
    public deviceID: number;
    public netID: number | null;

    public offsetX: number;
    public offsetY: number;

    public type: PIN_TYPE;
    public name: string;

    public value = VALUE.Z;
    public selected = false;

    public connectedPins: Set<number> = new Set();

    constructor(
        deviceID: number,
        offsetX: number,
        offsetY: number,
        type: PIN_TYPE,
        name = "pin"
    ) {
        this.id = pinID++;
        this.deviceID = deviceID;

        this.offsetX = offsetX;
        this.offsetY = offsetY;

        this.type = type;
        this.name = name;

        this.netID = null;
    }

    static connect(pinA: number, pinB: number) {
        getPin(pinA).connectedPins.add(pinB);
        getPin(pinB).connectedPins.add(pinA);
    }

    static disconnect(pinA: number, pinB: number) {
        getPin(pinA).connectedPins.delete(pinB);
        getPin(pinB).connectedPins.delete(pinA);
    }

    static setValue(pin: Pin, value: VALUE) {
        pin.value = value;
    }
}

export default Pin;