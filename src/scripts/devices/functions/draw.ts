import { ctx } from "../../main/reference";
import { CIRCUIT, DEVICE, MODE, SPRITES, VALUE, WORLD, deviceSize } from "../../main/setup";
import { getPin, isHovering } from "../../main/util";

import { Source } from "../source";
import Bulb from "../bulb";
import { Switch } from "../switch";

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

    source(device: Source) {
       
        ctx.drawImage(SPRITES[DEVICE.SOURCE], device.x, device.y, deviceSize, deviceSize);
        if (CIRCUIT.pins.get(device.outputPins[0])?.value === VALUE.HIGH) {
            ctx.fillStyle = 'yellowgreen';
        } else {
            ctx.fillStyle = 'tomato';
        }
        
        ctx.beginPath();
        ctx.arc(device.x + deviceSize / 2, device.y + deviceSize / 2, deviceSize / 3.1, 0, Math.PI * 2);
        ctx.fill();
        
        this.handleDeviceSelection(device);
        this.handleDeviceHovering(device);
    }

    bulb(device: Bulb) {
        ctx.drawImage(SPRITES[DEVICE.BULB], device.x, device.y, deviceSize, deviceSize);

        if (getPin(device.inputPins[0]).value === VALUE.HIGH) {
            ctx.fillStyle = 'orange';
            ctx.beginPath();
            ctx.arc(device.x + deviceSize / 2, device.y + deviceSize / 2, deviceSize / 3.1, 0, Math.PI * 2);
            ctx.fill();
        }

        this.handleDeviceSelection(device);
        this.handleDeviceHovering(device);
    }

    keySwitch(device: Switch) {
        ctx.drawImage(SPRITES[DEVICE.SWITCH], device.x, device.y, deviceSize, deviceSize);

        if (device.ON) ctx.fillStyle = "yellowgreen";
        else ctx.fillStyle = "tomato";

        ctx.beginPath();
        ctx.arc(device.x + deviceSize / 2, device.y + deviceSize / 2, deviceSize / 3.1, 0, Math.PI * 2);
        ctx.fill();

        this.handleDeviceSelection(device);
        this.handleDeviceHovering(device);
    }
}


export default Draw;