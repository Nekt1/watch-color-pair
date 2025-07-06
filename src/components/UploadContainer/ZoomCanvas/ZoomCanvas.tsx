import styles from "./zoomCanvas.module.scss";
import { ZOOM_CANVAS_SIZE } from "../../../constants";

interface ZoomCanvasProps {
	toggleZoom: boolean;
	zoomPosition: {
		x: number;
		y: number;
	};
	zoomCanvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export default function ZoomCanvas({
	toggleZoom,
	zoomPosition,
	zoomCanvasRef,
}: ZoomCanvasProps) {
	return (
		<>
			{toggleZoom && (
				<canvas
					className={styles.zoomCanvas}
					style={{ left: zoomPosition.x, top: zoomPosition.y }}
					width={ZOOM_CANVAS_SIZE}
					height={ZOOM_CANVAS_SIZE}
					ref={zoomCanvasRef}
				></canvas>
			)}
		</>
	);
}
