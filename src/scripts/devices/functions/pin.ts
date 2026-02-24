import Device from "../device";

class Pin {
    public name: string;
    public id: number;
    public deviceID: number;

    public x: number;
    public y: number;
    
    public offsetX = 0;
    public offsetY = 0;

    public value = 0;
    
    public selected = false;

    constructor(device: Device, offsetX: number, offsetY: number, name: string = "pin") {
        this.x = device.x + offsetX;
        this.y = device.y + offsetY;

        this.offsetX = offsetX;
        this.offsetY = offsetY;
        
        this.id = Date.now() + Math.floor(Math.random() * 1000);
        this.name = name;

        this.deviceID = device.id;
    }
}

export default Pin;