import type { LabValue } from "../../types";
import { ImageCanvas, type ImageCanvasRef } from "./ImageCanvas/ImageCanvas";

interface UploadContainerProps {
	imageLoaded: boolean;
	setImageLoaded: (arg: boolean) => void;
	setColor: (arg: LabValue) => void;
	ref: React.RefObject<ImageCanvasRef | null>;
}

// TODO
// extract logic related to file upload from ImageCanvas
// n put it in FileUploader

export default function UploadContainer({
	imageLoaded,
	setImageLoaded,
	setColor,
	ref,
}: UploadContainerProps) {
	return (
		<>
			<ImageCanvas
				ref={ref}
				setImageLoaded={setImageLoaded}
				imageLoaded={imageLoaded}
				setColor={setColor}
			/>
		</>
	);
}
