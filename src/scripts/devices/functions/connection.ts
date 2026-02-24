import Pin from "./pin";

class Connection {
    public FROM: Pin;
    public TO: Pin;

    constructor(FROM: Pin, TO: Pin) {
        this.FROM = FROM;
        this.TO = TO;
    }
}

export default Connection;