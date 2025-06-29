export function getCoords(
	e: React.MouseEvent<HTMLCanvasElement>,
	canvas: HTMLCanvasElement,
): [number, number] | undefined {
	const rect = canvas.getBoundingClientRect();
	if (!rect) return;
	const posX = e.clientX - rect.x;
	const posY = e.clientY - rect.y;
	return [posX, posY];
}
