createToolBar();

const update = () => {
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFFAFA";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    createGrid();

    requestAnimationFrame(update);
}

update();