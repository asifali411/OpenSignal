import { canvas, ctx } from "./scripts/main/reference";
import { WORLD } from "./scripts/main/setup";
import { resizeCanvas, createGrid } from "./scripts/main/util";
import { createDeviceBar,createExtraDeviceDialog, drawDevices, renderUndoRedoBtn } from "./scripts/main/script";
import './scripts/main/event';

createDeviceBar();
createExtraDeviceDialog();

const render = () => {
    
    resizeCanvas();
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#FFFAFA";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.scale(WORLD.camera.zoom, WORLD.camera.zoom);
    ctx.translate(-WORLD.camera.x, -WORLD.camera.y);

    createGrid();

    // render components
    drawDevices();

    renderUndoRedoBtn(); // TODO: do not render this at every frame. instead render the component on change.

    ctx.restore();
    
    requestAnimationFrame(render);
}

render();
