import { ctx } from "../../main/reference";
import { DEVICE, MODE, SPRITES, WORLD, deviceSize } from "../../main/setup";
import { isHovering, isHoveringPin } from "../../main/util";

import Pin from "./pin";
import { Source } from "../source";
import Ground from "../ground";

class Draw {

    private handleDeviceSelection(device: any) {

        if (!device.selected) return;

        ctx.beginPath();

        ctx.globalAlpha = 0.7;
        ctx.fillStyle = "#ddddfe";
        ctx.strokeStyle = "#ddddfe";

        ctx.roundRect(device.x, device.y, deviceSize, deviceSize, 5);
        ctx.fill();
        
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    private handleDeviceHovering(device: any) {

        if (!isHovering(device)) return;
        if (!(WORLD.mode === MODE.EDIT)) return;

        ctx.beginPath();

        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "#ddddfe";
        ctx.strokeStyle = "#ddddfe";

        ctx.roundRect(device.x, device.y, deviceSize, deviceSize, 5);
        ctx.fill();
        
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    private handlePinHovering(pin: Pin) {

        if (!isHoveringPin(pin)) return;
        if (!(WORLD.mode === MODE.EDIT)) return;

        ctx.beginPath();

        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "#ddddfe";
        ctx.strokeStyle = "#ddddfe";

        ctx.roundRect(pin.x - 10, pin.y - 10, 20, 20, 5);
        ctx.fill();
        
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    private handlePinSelection (pin: Pin) {
        
        if (!pin.selected) return;

        ctx.beginPath();

        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "#ddddfe";
        ctx.strokeStyle = "#ddddfe";

        ctx.roundRect(pin.x - 10, pin.y - 10, 20, 20, 5);
        ctx.fill();
        
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    private drawPins(device: any) {
        device.outputPins.forEach((pin: Pin) => {
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.arc(pin.x, pin.y, 5, 0, Math.PI * 2);
            ctx.fill();
            this.handlePinHovering(pin);
            this.handlePinSelection(pin);
        });

        device.inputPins.forEach((pin: Pin) => {
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.arc(pin.x, pin.y, 5, 0, Math.PI * 2);
            ctx.fill();
            this.handlePinHovering(pin);
            this.handlePinSelection(pin);
        });
    }

    //============================================================================//

    source(device: Source) {
       
        ctx.drawImage(SPRITES[DEVICE.SOURCE], device.x, device.y, deviceSize, deviceSize);
        if (device.outputPins[0].value === 0) {
            ctx.fillStyle = 'tomato';
        } else {
            ctx.fillStyle = 'yellowgreen';
        }
        
        ctx.beginPath();
        ctx.arc(device.x + deviceSize / 2, device.y + deviceSize / 2, deviceSize / 3.1, 0, Math.PI * 2);
        ctx.fill();
        
        this.handleDeviceSelection(device);
        this.handleDeviceHovering(device);
        this.drawPins(device);
    }

    ground(device: Ground) {

        this.handleDeviceSelection(device);
        this.handleDeviceHovering(device);

        ctx.drawImage(SPRITES[DEVICE.GROUND], device.x, device.y, deviceSize, deviceSize);

        this.drawPins(device);
    }
}


export default Draw;