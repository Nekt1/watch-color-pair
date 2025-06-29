import styles from "./colorModeToggle.module.scss";

interface ColorModeToggleProps {
	colorMode: boolean;
	changeMode: () => void;
}

export default function ColorModeToggle({
	colorMode,
	changeMode,
}: ColorModeToggleProps) {
	return (
		<div className={styles.modeToggleContainer}>
			<p>Color Match</p>
			<div className={styles.buttons}>
				<p className={styles.singleModeHeader}>single</p>
				<label htmlFor="colorModeToggle">
					<input
						type="checkbox"
						name="colorModeToggle"
						id="colorModeToggle"
						checked={!colorMode}
						onChange={changeMode}
					/>
					<span className={styles.toggleSlider}></span>
				</label>
				<p className={styles.dualModeHeader}>dual</p>
			</div>
		</div>
	);
}
