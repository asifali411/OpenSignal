const deviceBar = document.querySelector<HTMLDivElement>('.device-bar')!;
const extraDeviceDialog = document.querySelector<HTMLDivElement>('.extra-devices-dialog')!;
const extraDevices = document.querySelector<HTMLDivElement>('.extra-devices')!;
const overlay = document.querySelector<HTMLDivElement>('.overlay')!;
const transparentOverlay = document.querySelector<HTMLDivElement>(".transparent-overlay")!;
const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
const ctx = canvas.getContext('2d')!;
const fpsText = document.querySelector('.fps')!;
const contextDialog = document.querySelector<HTMLDivElement>('.context')!;
// const seeDetailsBtn = document.querySelector<HTMLDivElement>('.see-details')!;
const deleteDeviceBtn = document.querySelector<HTMLDivElement>('.delete-device')!;
const loadingScreen = document.querySelector<HTMLDivElement>('.loading-screen')!;
const progressBar = document.querySelector<HTMLDivElement>('.progress')!;

const buttons = {
    undo: document.querySelector<HTMLButtonElement>('.undo')!,
    redo: document.querySelector<HTMLButtonElement>('.redo')!,
    simulate: document.querySelector<HTMLButtonElement>('.simulate')!,
    edit: document.querySelector<HTMLButtonElement>('.edit')!,
    zoomIn: document.querySelector<HTMLButtonElement>('.zoom-in')!,
    zoomOut: document.querySelector<HTMLButtonElement>('.zoom-out')!,
    snapToGrid: document.querySelector<HTMLButtonElement>('.snap-to-grid')!,
    showLabel: document.querySelector<HTMLButtonElement>('.show-label')!
};

export {
    deviceBar,
    extraDeviceDialog,
    extraDevices,
    overlay,
    transparentOverlay,
    canvas,
    ctx,
    buttons,
    fpsText,
    contextDialog,
    // seeDetailsBtn,
    deleteDeviceBtn,
    loadingScreen,
    progressBar
 };