import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from "../../../constants";
import { loadImage } from "../../../utils/fileLoad";
import styles from "./fileUploader.module.scss";

interface FileUploaderProps {
	imageLoaded: boolean;
	setImage: (arg: HTMLImageElement) => void;
	setImageLoaded: (arg: boolean) => void;
}

export default function FileUploader({
	imageLoaded,
	setImage,
	setImageLoaded,
}: FileUploaderProps) {
	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (!e.target.files) return;
		const file: File = e.target.files[0];
		if (file.size > MAX_FILE_SIZE_BYTES) {
			throw new Error(`File size exceeds ${MAX_FILE_SIZE_MB} limit.`);
		}
		const img = await loadImage(file);
		setImage(img);
		setImageLoaded(true);
	}

	return (
		<>
			{!imageLoaded && (
				<div className={styles.placeholderButton}>
					<input
						type="file"
						accept=".jpg,.jpeg,.png,.avif,.webp"
						name="file"
						id="file"
						onChange={handleFileChange}
					/>
					<label className={styles.customFileUpload} htmlFor="file">
						+
					</label>
				</div>
			)}
		</>
	);
}
