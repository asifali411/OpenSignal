import { ctx } from "../../main/reference";
import { SPRITES, deviceSize } from "../../main/setup";

import Source from "../source";
import Ground from "../ground";

class Draw {

    private handleDeviceSelection(device: any) {
        if (device.selected) {
            ctx.save();
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = "#ddddfe";
            ctx.strokeStyle = "#ddddfe";

            ctx.fillRect(device.x, device.y, deviceSize, deviceSize);
            
            ctx.globalAlpha = 1;
            ctx.lineWidth = 2;
            ctx.strokeRect(device.x, device.y, deviceSize, deviceSize);

            ctx.restore();
        }
    }

    source(device: Source) {
        
        this.handleDeviceSelection(device);

        ctx.drawImage(SPRITES["Source"], device.x, device.y, deviceSize, deviceSize);
        if (device.out.voltage <= 0.2) {
            ctx.fillStyle = 'tomato';
        } else {
            ctx.fillStyle = 'yellowgreen';
        }
        
        ctx.beginPath();
        ctx.arc(device.x + deviceSize / 2, device.y + deviceSize / 2, deviceSize / 3.1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(device.x + deviceSize + 5, device.y + deviceSize / 2, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    ground(device: Ground) {

        this.handleDeviceSelection(device);

        ctx.drawImage(SPRITES["Ground"], device.x, device.y, deviceSize, deviceSize);

        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(device.x + deviceSize/2, device.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}


export default Draw;