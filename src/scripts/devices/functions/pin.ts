import { PIN_TYPE, VALUE } from "../../main/setup";
import { getPin } from "../../main/util";

let pinID = 0;
class Pin {
    public readonly id: number;
    public readonly deviceID: number;
    public netID: number | null;

    public readonly offsetX: number;
    public readonly offsetY: number;

    public readonly type: PIN_TYPE;
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
}

export default Pin;