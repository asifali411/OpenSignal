import { ctx } from "../main/reference";
import { SPRITES, deviceSize } from "../main/setup";

import Source from "./source";
import Ground from "./ground";

class Draw {
    source(device: Source) {
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
        ctx.drawImage(SPRITES["Ground"], device.x, device.y, deviceSize, deviceSize);

        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(device.x + deviceSize/2, device.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}


export default Draw;