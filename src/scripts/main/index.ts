
//========================= DEVICE BAR ========================//

const createDeviceBar = (): void => {
    
    for(let i = 0; i < Math.min(Math.floor(deviceBar.getBoundingClientRect().width / 60), DEVICES.length); i++){
        const deviceBTN = document.createElement('button');
        deviceBTN.classList.add("device");
        deviceBTN.title = DEVICES[i].name;

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
const reRenderDeviceBar = (): void => {
    const visibleDevices = Array(...document.querySelectorAll(".device-bar .device"));
    
    visibleDevices.forEach(device => {
        device.remove();
    })
    
    createDeviceBar();
}
const createExtraDeviceDialog = () => {
    for(let i = 0; i < DEVICES.length; i++){
        extraDevices.innerHTML += `
            <button class="device" title="${DEVICES[i].name}" idx="${i}">
                <img src="${DEVICES[i].img}">
            </button>
        `;
    }
}

//========================= ZOOM IN OUT ========================//

const setZoomPercentage = () => {
    const percentage = Math.round(WORLD.camera.zoom * 100);
    document.querySelector('.zoom-percentage')!.textContent = `${percentage}%`;
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

//========================= DIALOG BOX ========================//

const closeDialog = () => {
    WORLD.dialog.show = false;
    overlay.classList.add('hidden');
    closeExtraDevices();
}
const openExtraDevices = () => {
    extraDeviceDialog.classList.remove('hidden');
    WORLD.dialog.show = true;
    overlay.classList.remove('hidden');
}
const closeExtraDevices = () => extraDeviceDialog.classList.add('hidden');

//========================= MODE ========================//

const changeMode = () => {
    if (WORLD.mode === MODE.PAN) {
        WORLD.mode = MODE.EDIT;
        canvas.style.cursor = 'pointer';
    } else if (WORLD.mode === MODE.EDIT) {
        WORLD.mode = MODE.PAN;
        canvas.style.cursor = 'grab';
    }
}