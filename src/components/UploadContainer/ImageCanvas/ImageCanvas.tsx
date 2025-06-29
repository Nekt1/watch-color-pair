import clsx from "clsx";
import styles from "./imageCanvas.module.scss";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { drawZoomedGrid, fillCanvas } from "../../../utils/gridDraw";
import { loadImage } from "../../../utils/fileLoad";
import { ZOOM_CANVAS_OFFSET, ZOOM_CANVAS_SIZE } from "../../../constants";
import { rgbToLab } from "../../../utils/colorConversions";
import { getCoords } from "../../../utils/getCoords";
import React from "react";
import type { Image, LabValue } from "../../../types";
import FileUploader from "../FileUploader/FileUploader";

export interface ImageCanvasRef {
	clearCanvas: () => void;
	resetImage: () => void;
}

interface ImageCanvasProps {
	setImageLoaded: (arg: boolean) => void;
	imageLoaded: boolean;
	setColor: (arg: LabValue) => void;
}

export const ImageCanvas = React.forwardRef<
	ImageCanvasRef | null,
	ImageCanvasProps
>(({ setImageLoaded, imageLoaded, setColor }, ref) => {
	const canvasContainerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ctxRef = useRef<CanvasRenderingContext2D>(null);
	const zoomCanvasRef = useRef<HTMLCanvasElement>(null);
	const [image, setImage] = useState<HTMLImageElement | null>(null);
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

	// function handleZoomEnter() {
	//     if (!imageLoaded) return;
	//     setToggleZoom(true)
	// }

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

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		// TODO add a file size check
		if (!e.target.files || !ctxRef.current || !canvasRef.current) return;
		const file: File = e.target.files[0];
		const img = await loadImage(file);
		setImage(img);

		const ctx = ctxRef.current;
		const canvasHeight = canvasRef.current.height;
		const canvasWidth = canvasRef.current.width;

		const imgPosition = fillCanvas(ctx, canvasHeight, canvasWidth, img);
		setImageLoaded(true);
		setImageProperties({
			x: imgPosition.x,
			y: imgPosition.y,
			width: img.width,
			height: img.height,
		});
	}

	return (
		<div ref={canvasContainerRef} className={styles.uploadContainer}>
			<canvas
				className={clsx(styles.canvas, {
					[styles.canvasPlaceholder]: !imageLoaded,
				})}
				ref={canvasRef}
				onClick={handleClick}
				onMouseMove={handleMove}
				// onMouseEnter={handleZoomEnter}
				onMouseLeave={handleZoomLeave}
			></canvas>
			<FileUploader
				imageLoaded={imageLoaded}
				handleFileChange={handleFileChange}
			/>
			{toggleZoom && (
				<canvas
					className={styles.zoom}
					style={{ left: zoomPosition.x, top: zoomPosition.y }}
					width={ZOOM_CANVAS_SIZE}
					height={ZOOM_CANVAS_SIZE}
					ref={zoomCanvasRef}
				></canvas>
			)}
		</div>
	);
});
