import { canvas, ctx, fpsText } from "./scripts/main/reference";
import { WORLD } from "./scripts/main/setup";
import { resizeCanvas, createGrid } from "./scripts/main/util";
import {
    createDeviceBar,
    createExtraDeviceDialog,
    drawDevices,
    renderSnapToGridBtn,
    renderUndoRedoBtn
} from "./scripts/main/script";
import './scripts/main/event';

createDeviceBar();
createExtraDeviceDialog();
renderSnapToGridBtn();

let lastTime = performance.now();
let fps = 60;
const fpsSmoothing = 0.9;

const render = () => {

    // show fps
    const dt = performance.now() - lastTime;
    if(dt !== 0){
        const currentFps = Math.round(1000/dt);
        fps = fps * fpsSmoothing + currentFps * (1 - fpsSmoothing);

        fpsText.textContent = String(Math.round(fps));
    }

    
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
    lastTime = performance.now();
    requestAnimationFrame(render);
}

render();
