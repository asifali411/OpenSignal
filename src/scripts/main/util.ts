const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const createGrid = () => {
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = '#444';

    for(let x = -canvas.width * 10; x < canvas.width * 10; x+=tileSize){
        ctx.moveTo(x, -canvas.height * 10);
        ctx.lineTo(x, canvas.height * 10);
    }
    for (let y = -canvas.height * 10; y < canvas.height * 10; y += tileSize) {
        ctx.moveTo(-canvas.width * 10, y);
        ctx.lineTo(canvas.width * 10, y);
    }

    ctx.stroke();
    ctx.globalAlpha = 1;
}

type Point = {
    x: number,
    y: number
}
const toWorld = (x: number, y: number): Point => {
    return {
        x: (x - canvas.width / 2) / WORLD.camera.zoom + WORLD.camera.x,
        y: (y - canvas.height / 2) / WORLD.camera.zoom + WORLD.camera.y
    };
}

const isHovering = (device: any): boolean => {
    return (MOUSE.x >= device.x && MOUSE.x <= device.x + deviceSize && MOUSE.y >= device.y && MOUSE.y <= device.y + deviceSize);
}