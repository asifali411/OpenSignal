import { CIRCUIT, HISTORY } from "./setup";

import { registerButtonEvents } from "../events/button";
import { registerMouseEvents } from "../events/mouse";
import { registerWindowEvents } from "../events/window";
import { deconstructCircuit } from "./script";

export default function registerEvents () {
    registerMouseEvents();
    registerButtonEvents();
    registerWindowEvents();

    //=================================== DEBUG ===================================//
    
    window.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "/") console.log(deconstructCircuit());
    });
    
    window.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "1") console.log(HISTORY);
    });
}