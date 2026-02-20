const deviceBar = document.querySelector<HTMLDivElement>('.device-bar')!;
const extraDeviceDialog = document.querySelector<HTMLDivElement>('.extra-devices-dialog')!;
const extraDevices = document.querySelector<HTMLDivElement>('.extra-devices')!;
const overlay = document.querySelector<HTMLDivElement>('.overlay')!;
const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
const ctx = canvas.getContext('2d')!;
const fpsText = document.querySelector('.fps')!;

const buttons = {
    undo: document.querySelector<HTMLButtonElement>('.undo')!,
    redo: document.querySelector<HTMLButtonElement>('.redo')!,
    pan: document.querySelector<HTMLButtonElement>('.pan')!,
    simulate: document.querySelector<HTMLButtonElement>('.simulate')!,
    edit: document.querySelector<HTMLButtonElement>('.edit')!,
    zoomIn: document.querySelector<HTMLButtonElement>('.zoom-in')!,
    zoomOut: document.querySelector<HTMLButtonElement>('.zoom-out')!,
    snapToGrid: document.querySelector<HTMLButtonElement>('.snap-to-grid')!
};

export {
    deviceBar,
    extraDeviceDialog,
    extraDevices,
    overlay,
    canvas,
    ctx,
    buttons,
    fpsText
 };