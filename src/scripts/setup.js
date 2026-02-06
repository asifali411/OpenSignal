const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const tileSize = 30;

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const createGrid = () => {
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = '#444';

    for(let x = 0; x < canvas.width + tileSize; x+=tileSize){
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (let y = 0; y < canvas.height + tileSize; y += tileSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }

    ctx.stroke();
    ctx.globalAlpha = 1;
}