import {
	ZOOM_CANVAS_AREA,
	ZOOM_CANVAS_GRID_SIZE,
	ZOOM_CANVAS_SIZE,
} from "../constants";

export function drawGrid(ctx: CanvasRenderingContext2D) {
	const gridSize = ZOOM_CANVAS_SIZE / ZOOM_CANVAS_GRID_SIZE;
	const centerIdx = Math.ceil(ZOOM_CANVAS_GRID_SIZE / 2);
	for (let i = 0; i < ZOOM_CANVAS_GRID_SIZE; i++) {
		for (let j = 0; j < ZOOM_CANVAS_GRID_SIZE; j++) {
			ctx.save();
			ctx.lineWidth = 0.5;
			const row = i * gridSize;
			const col = j * gridSize;
			ctx.beginPath();
			ctx.rect(row, col, gridSize, gridSize);
			if (j === centerIdx - 1 && i === centerIdx - 1) {
				ctx.lineWidth = 5;
				ctx.rect(row, col, gridSize, gridSize);
			}
			ctx.stroke();
			ctx.restore();
		}
	}
}

// TODO
// add proper background color fill style when decided on the palette
export function drawZoomedGrid(
	posX: number,
	posY: number,
	zoomCanvasCtx: CanvasRenderingContext2D,
	initialCanvas: HTMLCanvasElement,
) {
	zoomCanvasCtx.clearRect(0, 0, ZOOM_CANVAS_SIZE, ZOOM_CANVAS_SIZE);
	zoomCanvasCtx.fillStyle = "white";
	zoomCanvasCtx.fillRect(0, 0, ZOOM_CANVAS_SIZE, ZOOM_CANVAS_SIZE);
	zoomCanvasCtx.drawImage(
		initialCanvas,
		posX - ZOOM_CANVAS_AREA,
		posY - ZOOM_CANVAS_AREA,
		ZOOM_CANVAS_AREA * 2,
		ZOOM_CANVAS_AREA * 2,
		0,
		0,
		ZOOM_CANVAS_SIZE,
		ZOOM_CANVAS_SIZE,
	);
	drawGrid(zoomCanvasCtx);
}

export function fillCanvas(
	ctx: CanvasRenderingContext2D,
	canvasHeight: number,
	canvasWidth: number,
	img: HTMLImageElement,
) {
	let offsetX = 0;
	let offsetY = 0;
	let scaleX = 1;
	let scaleY = 1;

	if (img.width > canvasWidth) {
		scaleX = canvasWidth / img.width;
	}

	if (img.height > canvasHeight) {
		scaleY = canvasHeight / img.height;
	}

	if (img.width < canvasWidth) {
		offsetX = (canvasWidth - img.width) / 2;
	}

	if (img.height < canvasHeight) {
		offsetY = (canvasHeight - img.height) / 2;
	}

	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	ctx.scale(scaleX, scaleY);
	ctx.drawImage(img, offsetX, offsetY);

	return { x: offsetX, y: offsetY };
}
