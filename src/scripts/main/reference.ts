const deviceBar = document.querySelector<HTMLDivElement>('.device-bar')!;
const extraDeviceDialog = document.querySelector<HTMLDivElement>('.extra-devices-dialog')!;
const extraDevices = document.querySelector<HTMLDivElement>('.extra-devices')!;
const overlay = document.querySelector<HTMLDivElement>('#dialog-overlay')!;
const transparentOverlay = document.querySelector<HTMLDivElement>('.transparent-overlay')!;
const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
const ctx = canvas.getContext('2d')!;
const fpsText = document.querySelector('.fps')!;
const contextDialog = document.querySelector<HTMLDivElement>('#context-menu')!;
const deleteDeviceBtn = document.querySelector<HTMLDivElement>('.delete-device')!;
const loadingScreen = document.querySelector<HTMLDivElement>('.loading-screen')!;
const progressBar = document.querySelector<HTMLDivElement>('.progress')!;
const toast = document.querySelector<HTMLDivElement>('#toast')!;
const toastMessage = document.querySelector<HTMLDivElement>('.toast-message')!;
const srAnnouncer = document.querySelector<HTMLDivElement>('#sr-announcer')!;

// Save dialog
const saveDialog = document.querySelector<HTMLDivElement>('#save-dialog')!;
const saveDialogClose = saveDialog.querySelector<HTMLButtonElement>('.save-dialog-close')!;
const saveDialogCancel = saveDialog.querySelector<HTMLButtonElement>('.save-dialog-cancel')!;
const saveDialogConfirm = saveDialog.querySelector<HTMLButtonElement>('.save-dialog-confirm')!;
const saveFilenameInput = document.querySelector<HTMLInputElement>('#save-filename-input')!;
const saveFilenameError = document.querySelector<HTMLParagraphElement>('#save-filename-error')!;

const buttons = {
    undo: document.querySelector<HTMLButtonElement>('.undo')!,
    redo: document.querySelector<HTMLButtonElement>('.redo')!,
    simulate: document.querySelector<HTMLButtonElement>('.simulate')!,
    edit: document.querySelector<HTMLButtonElement>('.edit')!,
    zoomIn: document.querySelector<HTMLButtonElement>('.zoom-in')!,
    zoomOut: document.querySelector<HTMLButtonElement>('.zoom-out')!,
    snapToGrid: document.querySelector<HTMLButtonElement>('.snap-to-grid')!,
    showLabel: document.querySelector<HTMLButtonElement>('.show-label')!,
    open: document.querySelector<HTMLButtonElement>('.open')!,
    save: document.querySelector<HTMLButtonElement>('.save')!,
    help: document.querySelector<HTMLButtonElement>('.help')!
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
    deleteDeviceBtn,
    loadingScreen,
    progressBar,
    toast,
    toastMessage,
    srAnnouncer,
    saveDialog,
    saveDialogClose,
    saveDialogCancel,
    saveDialogConfirm,
    saveFilenameInput,
    saveFilenameError,
};