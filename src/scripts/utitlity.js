const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
const createGrid = () => {
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = '#444';

    for(let x = -canvas.width * 10; x < canvas.width * 10; x+=tileSize){
        ctx.moveTo(x, -canvas.height * 10);
        ctx.lineTo(x, canvas.height * 10);
    }
    for (let y = -canvas.height * 10; y < canvas.height * 10; y += tileSize) {
        ctx.moveTo(-canvas.width * 10, y);
        ctx.lineTo(canvas.width * 10, y);
    }

    ctx.stroke();
    ctx.globalAlpha = 1;
}
const createDeviceBar = () => {

    for(let i = 0; i < Math.min(Math.floor(deviceBar.getBoundingClientRect().width / 60), DEVICES.length); i++){
        const deviceBTN = document.createElement('button');
        deviceBTN.classList.add("device");
        deviceBTN.title = DEVICES[i].device;

        const deviceIMG = document.createElement("img");
        deviceIMG.src = DEVICES[i].img;

        deviceBTN.append(deviceIMG);
        deviceBar.append(deviceBTN);

        deviceBTN.addEventListener('click', () => {
            DEVICES[i].click();
        });
    }

    const deviceBTN = document.createElement('button');
    deviceBTN.classList.add("device");
    deviceBTN.classList.add("extra-device-toggle-button");
    deviceBTN.title = "All components";

    const deviceIMG = document.createElement("img");
    deviceIMG.src = "../src/assets/ellipsis.svg";

    deviceBTN.append(deviceIMG);
    deviceBar.append(deviceBTN);

    deviceBTN.addEventListener('click', () => {
        openExtraDevices();
    });
}
const reRenderDeviceBar = () => {
    const visibleDevices = Array(...document.querySelectorAll(".device-bar .device"));
    
    visibleDevices.forEach(device => {
        device.remove();
    })
    
    createDeviceBar();
}
const createExtraDeviceDialog = () => {
    for(let i = 0; i < DEVICES.length; i++){
        extraDevices.innerHTML += `
            <button class="device" title="${DEVICES[i].device}" idx="${i}">
                <img src="${DEVICES[i].img}">
            </button>
        `;
    }
}
const toWorld = (x, y) => {
    return {
        x: (x - canvas.width/2) / WORLD.camera.zoom + WORLD.camera.x,
        y: (y - canvas.height/2) / WORLD.camera.zoom + WORLD.camera.y,
    }
}
const setZoomPercentage = () => {
    const percentage = Math.round(WORLD.camera.zoom * 100);
    document.querySelector('.zoom-percentage').textContent = `${percentage}%`;
}
const zoomIN = () => {
    if(WORLD.camera.zoom >= 4) return;
    WORLD.camera.zoom += 0.1;
    setZoomPercentage();
}
const zoomOUT = () => {
    if(WORLD.camera.zoom <= 0.2) return;
    WORLD.camera.zoom -= 0.1;
    setZoomPercentage();
}
const closeDialog = () => {
    WORLD.dialog.show = false;
    overlay.classList.add('hidden');
    switch(WORLD.dialog.box){
        case EXTRA_DEVICES:
            closeExtraDevices();
            break;
        default:
            throw new Error(`Invalid dialog box: ${WORLD.dialog.box}`);
    }
}
const openExtraDevices = () => {
    extraDeviceDialog.classList.remove('hidden');
    WORLD.dialog.show = true;
    overlay.classList.remove('hidden');
}
const closeExtraDevices = () => extraDeviceDialog.classList.add('hidden');
const renderUndoRedoBtn = () => {
    if (HISTORY.undoStack.length <= 1) {
        undoBtn.disabled = true;
    } else {
        undoBtn.disabled = false;
    }

    if (HISTORY.redoStack.length === 0) {
        redoBtn.disabled = true;
    } else {
        redoBtn.disabled = false;
    }
}