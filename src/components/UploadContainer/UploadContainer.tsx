import { useState } from "react";
import type { LabValue } from "../../types";
import ManualColorPicker from "../Controls/ManualColorPicker/ManualColorPicker";
import FileUploader from "./FileUploader/FileUploader";
import { ImageCanvas, type ImageCanvasRef } from "./ImageCanvas/ImageCanvas";
import styles from "./uploadContainer.module.scss";

interface UploadContainerProps {
	imageLoaded: boolean;
	setImageLoaded: (arg: boolean) => void;
	setColor: (arg: LabValue) => void;
	ref: React.RefObject<ImageCanvasRef | null>;
	isManualMode: boolean;
	setManualColor: (arg: LabValue) => void;
}

export default function UploadContainer({
	imageLoaded,
	setImageLoaded,
	setColor,
	ref,
	isManualMode,
	setManualColor,
}: UploadContainerProps) {
	const [image, setImage] = useState<HTMLImageElement | null>(null);

	return (
		<div className={styles.uploadContainerMain}>
			{!isManualMode && (
				<ImageCanvas
					ref={ref}
					setImageLoaded={setImageLoaded}
					imageLoaded={imageLoaded}
					setColor={setColor}
					image={image}
					setImage={setImage}
				/>
			)}
			<FileUploader
				imageLoaded={imageLoaded}
				setImage={setImage}
				setImageLoaded={setImageLoaded}
			/>
			{isManualMode && <ManualColorPicker setManualColor={setManualColor} />}
		</div>
	);
}
