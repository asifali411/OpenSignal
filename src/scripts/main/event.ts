import { CIRCUIT, HISTORY } from "./setup";

import { registerButtonEvents } from "../events/button";
import { registerMouseEvents } from "../events/mouse";
import { registerWindowEvents } from "../events/window";

export default function registerEvents () {
    registerMouseEvents();
    registerButtonEvents();
    registerWindowEvents();

    //=================================== DEBUG ===================================//
    
    window.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "/") console.debug(CIRCUIT);
    });
    
    window.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "1") console.debug(HISTORY);
    });
}