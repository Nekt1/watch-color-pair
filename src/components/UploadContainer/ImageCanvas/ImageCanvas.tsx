import clsx from "clsx";
import styles from "./imageCanvas.module.scss";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { drawZoomedGrid, fillCanvas } from "../../../utils/gridDraw";
import { ZOOM_CANVAS_OFFSET } from "../../../constants";
import { rgbToLab } from "../../../utils/colorConversions";
import { getCoords } from "../../../utils/getCoords";
import React from "react";
import type { Image, LabValue } from "../../../types";
import ZoomCanvas from "../ZoomCanvas/ZoomCanvas";
import { isMobile } from "react-device-detect";
export interface ImageCanvasRef {
	clearCanvas: () => void;
	resetImage: () => void;
}
interface ImageCanvasProps {
	setImageLoaded: (arg: boolean) => void;
	imageLoaded: boolean;
	setColor: (arg: LabValue) => void;
	image: HTMLImageElement | null;
	setImage: (arg: HTMLImageElement | null) => void;
}

export const ImageCanvas = React.forwardRef<
	ImageCanvasRef | null,
	ImageCanvasProps
>(({ imageLoaded, setColor, image, setImage }, ref) => {
	const canvasContainerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ctxRef = useRef<CanvasRenderingContext2D>(null);
	const zoomCanvasRef = useRef<HTMLCanvasElement>(null);
	const [imageProperties, setImageProperties] = useState<Image>({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	});
	const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
	const [toggleZoom, setToggleZoom] = useState<boolean>(false);

	useImperativeHandle(
		ref,
		() => ({
			clearCanvas() {
				if (!canvasRef.current) return;
				const ctx = canvasRef.current?.getContext("2d");
				if (!ctx) return;
				ctx.clearRect(0, 0, canvasRef.current.height, canvasRef.current.width);
			},
			resetImage() {
				setImage(null);
			},
		}),
		[],
	);

	function handleResize() {
		const canvas = canvasRef.current;
		const ctx = ctxRef.current;
		const canvasContainer = canvasContainerRef.current;
		if (!ctx || !canvas || !canvasContainer) return;

		canvas.height = canvasContainer.offsetHeight;
		canvas.width = canvasContainer.offsetWidth;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (image) {
			const imgPosition = fillCanvas(ctx, canvas.height, canvas.width, image);
			setImageProperties({
				x: imgPosition.x,
				y: imgPosition.y,
				width: image.width,
				height: image.height,
			});
		}
	}

	useEffect(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvasRef.current.getContext("2d", {
			willReadFrequently: true,
		});
		ctxRef.current = ctx;
		const container = canvasContainerRef.current;
		if (!container || !ctx || !canvas) return;

		handleResize();

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [image]);

	function handleZoomLeave() {
		setToggleZoom(false);
	}

	function handleMove(e: React.MouseEvent<HTMLCanvasElement>) {
		if (!canvasRef.current) return;
		const coords = getCoords(e, canvasRef.current);
		if (!coords) return;
		const [posX, posY] = coords;
		if (imageLoaded) {
			if (
				posX >= imageProperties.x &&
				posY >= imageProperties.y &&
				posX <= imageProperties.x + imageProperties.width &&
				posY <= imageProperties.y + imageProperties.height
			) {
				setToggleZoom(true);
			} else if (toggleZoom) {
				setToggleZoom(false);
			}
		}

		if (toggleZoom) {
			if (!zoomCanvasRef.current) return;
			const zoomCanvasCtx = zoomCanvasRef.current.getContext("2d");
			if (!zoomCanvasCtx) return;
			drawZoomedGrid(posX, posY, zoomCanvasCtx, canvasRef.current);
			setZoomPosition({
				x: posX + ZOOM_CANVAS_OFFSET.x,
				y: posY + ZOOM_CANVAS_OFFSET.y,
			});
		}
	}

	function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
		if (!canvasRef.current || !ctxRef.current || !imageLoaded) return;
		const coords = getCoords(e, canvasRef.current);
		if (coords) {
			const [posX, posY] = coords;
			const color = ctxRef.current.getImageData(posX, posY, 1, 1).data;
			const [valueR, valueG, valueB] = color;
			const labColor = rgbToLab(valueR, valueG, valueB);
			setColor(labColor);
		}
	}

	return (
		<div ref={canvasContainerRef} className={styles.uploadContainer}>
			<canvas
				className={clsx(styles.mainCanvas, {
					[styles.canvasPlaceholder]: !imageLoaded,
				})}
				ref={canvasRef}
				onClick={handleClick}
				onMouseMove={handleMove}
				onMouseLeave={handleZoomLeave}
			></canvas>
			{toggleZoom && !isMobile && (
				<ZoomCanvas
					toggleZoom={toggleZoom}
					zoomPosition={zoomPosition}
					zoomCanvasRef={zoomCanvasRef}
				/>
			)}
		</div>
	);
});
