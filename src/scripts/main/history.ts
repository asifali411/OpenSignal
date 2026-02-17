class HistoryManager {
    
    public undoStack: any;
    public redoStack: any;
    private limit: number;

    constructor(limit = 20) {
        this.undoStack = [];
        this.redoStack = [];
        this.limit = limit;
    }

    save(circuit: any) {
        if (this.undoStack.length >= this.limit) this.undoStack.shift();

        this.undoStack.push(structuredClone(circuit));
        this.redoStack = [];
    }

    undo() {
        if (this.undoStack.length <= 1) return;
        
        this.redoStack.push(this.undoStack.pop());
        return structuredClone(
            this.undoStack[this.undoStack.length - 1]
        );
    }
    
    redo() {
        if (this.redoStack.length === 0) return;

        const state = structuredClone(this.redoStack.pop());
        this.undoStack.push(state);

        return state;
    }
}

export default HistoryManager;