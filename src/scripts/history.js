class History {
    constructor(limit = 20) {
        this.undoStack = [];
        this.redoStack = [];
        this.limit = limit;
    }

    saveState() {
        if (this.undoStack.length >= this.limit) {
            this.undoStack.shift();
        }

        this.undoStack.push(structuredClone(CIRCUIT));
        this.redoStack = [];
        renderUndoRedoBtn();
    }

    undo() {
        if (this.undoStack.length <= 1) return;

        this.redoStack.push(this.undoStack.pop());
        CIRCUIT = structuredClone(
            this.undoStack[this.undoStack.length - 1]
        );
        renderUndoRedoBtn();
    }

    redo() {
        if (this.redoStack.length === 0) return;

        const state = this.redoStack.pop();
        this.undoStack.push(structuredClone(state));
        CIRCUIT = structuredClone(state);
        renderUndoRedoBtn();
    }
}

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
const renderModeBtn = () => {
    
    document.querySelectorAll('.mode button').forEach(tool => {
        tool.classList.remove('selected');
    });

    if (WORLD.mode === PAN) {
        BUTTONS.pan.classList.add('selected');
    } else if (WORLD.mode === EDIT) {
        BUTTONS.edit.classList.add('selected');
    }
}