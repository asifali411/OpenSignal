import { CIRCUIT, HISTORY, MODE, SETTINGS } from "../main/setup";
import { buttons } from "../main/reference";
import { 
    handleModeButtonSelection, 
    renderSnapToGridBtn, 
    snapToGrid, 
    renderShowLabelBtn, 
    zoomIN, 
    zoomOUT,
    openCircuit,
    openSaveDialog
} from "../main/script";
import { saveSettings, setSetting } from "../../settings";

const handleSnapToGrid = () => {
    SETTINGS.snapToGrid = !SETTINGS.snapToGrid;
    if (SETTINGS.snapToGrid) snapToGrid();
    setSetting("snapToGrid", SETTINGS.snapToGrid);
    saveSettings(SETTINGS);
    renderSnapToGridBtn();
};

const handleShowLabel = () => {
    SETTINGS.showLabel = !SETTINGS.showLabel;
    setSetting("showLabel", SETTINGS.showLabel);
    saveSettings(SETTINGS);
    renderShowLabelBtn();
};


export const registerButtonEvents = () => {
    buttons.undo.addEventListener(      "click", () => Object.assign(CIRCUIT, HISTORY.undo()));
    buttons.redo.addEventListener(      "click", () => Object.assign(CIRCUIT, HISTORY.redo()));

    buttons.edit.addEventListener(      "click", () => handleModeButtonSelection(MODE.EDIT));
    buttons.simulate.addEventListener(  "click", () => handleModeButtonSelection(MODE.SIMULATE));

    buttons.zoomIn.addEventListener(    "click", () => zoomIN());
    buttons.zoomOut.addEventListener(   "click", () => zoomOUT());

    buttons.snapToGrid.addEventListener("click", () => handleSnapToGrid());
    buttons.showLabel.addEventListener( "click", () => handleShowLabel());

    buttons.open.addEventListener(      "click", () => openCircuit());
    buttons.save.addEventListener(      "click", () => openSaveDialog());
}

