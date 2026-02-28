import { PIN_TYPE } from "../../main/setup";

let pinID = 0;
class Pin {
    public readonly id: number;
    public readonly deviceID: number;

    public readonly offsetX: number;
    public readonly offsetY: number;

    public readonly type: PIN_TYPE;
    public name: string;

    public value = 0;
    public selected = false;

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
    }
}

export default Pin;