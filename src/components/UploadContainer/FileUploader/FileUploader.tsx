import styles from "./fileUploader.module.scss";

interface FileUploaderProps {
	imageLoaded: boolean;
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileUploader({
	imageLoaded,
	handleFileChange,
}: FileUploaderProps) {
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
