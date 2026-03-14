import { overlay } from "../main/reference";
import { getDevice } from "../main/util";
import { 
    closeDialog, 
    openExtraDevices, 
    reRenderDeviceBar, 
    changeMode, 
    deleteDevice, 
    handleModeButtonSelection
} from "../main/script";
import { MODE, WORLD, CIRCUIT, HISTORY } from "../main/setup";
import { zoomIN, zoomOUT } from "../main/script";

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && WORLD.dialog.show) {
        closeDialog();
        return;
    }

    if (!e.ctrlKey && !e.shiftKey) {
        switch (e.key) {
            case "e":
            case "E":
                handleModeButtonSelection(MODE.EDIT);
                break;
            case "s":
            case "S":
                handleModeButtonSelection(MODE.SIMULATE);
                break;
            case "Delete": {
                const devicesToDelete: number[] = [];
                for (const [deviceID, device] of CIRCUIT.devices) {
                    if (device.selected) devicesToDelete.push(deviceID);
                }
                devicesToDelete.forEach((deviceID) => {
                    deleteDevice(getDevice(deviceID));
                });
                break;
            }
        }
    }

    if (e.ctrlKey) {
        switch (e.key) {
            case "-":
                zoomOUT();
                break;
            case "=":
                zoomIN();
                break;
            case "z":
            case "Z":
                Object.assign(CIRCUIT, HISTORY.undo());
                break;
            case "y":
            case "Y":
                Object.assign(CIRCUIT, HISTORY.redo());
                break;
            case ",":
            case "ArrowLeft":
                changeMode(-1);
                break;
            case ".":
            case "ArrowRight":
                changeMode(1);
                break;
        }
    }
};



export const registerWindowEvents = () => {
    overlay.addEventListener("click", closeDialog);
    document.querySelector(".extra-device-toggle-button")?.addEventListener("click", openExtraDevices);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", reRenderDeviceBar);
};