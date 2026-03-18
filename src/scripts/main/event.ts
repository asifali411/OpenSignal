import { GRID, HISTORY } from "./setup";

import { registerButtonEvents } from "../events/button";
import { registerMouseEvents } from "../events/mouse";
import { registerWindowEvents } from "../events/window";
import { getNeighbouringDevices } from "./script";

export default function registerEvents () {
    registerMouseEvents();
    registerButtonEvents();
    registerWindowEvents();

    //=================================== DEBUG ===================================//
    
    window.addEventListener("keydown", (e: KeyboardEvent) => {
        if (!(e.ctrlKey && e.key === "/")) return;

        console.log(GRID);

        for(const [, deviceSet] of GRID.devices){
            for(const deviceID of deviceSet){
                console.log(getNeighbouringDevices(deviceID));
            }
        }

    });
    
    window.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "1") console.debug(HISTORY);
    });
}