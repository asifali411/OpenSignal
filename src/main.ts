import { canvas, ctx, fpsText } from "./scripts/main/reference";
import { MOUSE, WORLD } from "./scripts/main/setup";
import { resizeCanvas, createGrid } from "./scripts/main/util";
import {
    createDeviceBar,
    createExtraDeviceDialog,
    setupContextMenuListeners,
    drawDevices,
    drawWire,
    renderShowLabelBtn,
    renderSnapToGridBtn
} from "./scripts/main/script";
import "./scripts/main/event";
import  registerEvents from "./scripts/main/event";

createDeviceBar();
createExtraDeviceDialog();
setupContextMenuListeners();
renderSnapToGridBtn();
renderShowLabelBtn();
registerEvents();

let lastTime = performance.now();
let fps = 60;
const fpsSmoothing = 0.9;

const render = () => {
    // show fps
    const dt = performance.now() - lastTime;
    if (dt !== 0) {
        const currentFps = Math.round(1000 / dt);
        fps = fps * fpsSmoothing + currentFps * (1 - fpsSmoothing);

        fpsText.textContent = String(Math.round(fps));
    }

    resizeCanvas();
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFFAFA";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(WORLD.camera.zoom, WORLD.camera.zoom);
    ctx.translate(-WORLD.camera.x, -WORLD.camera.y);

    createGrid();

    if(MOUSE.isClicking.left && WORLD.movingDevice == null){
        const dx = MOUSE.x - MOUSE.lastX;
        const dy = MOUSE.y - MOUSE.lastY;
        ctx.beginPath();
        ctx.roundRect(MOUSE.lastX, MOUSE.lastY, dx, dy, 5);
        ctx.strokeStyle = "#333";
        ctx.stroke();
    }

    drawWire(ctx);

    // render components
    drawDevices();

    ctx.restore();
    lastTime = performance.now();
    requestAnimationFrame(render);
};

render();
