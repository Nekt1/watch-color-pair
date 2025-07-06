import styles from "./toggle.module.scss";

interface ToggleProps {
	isDisabled: boolean;
	handleChange: () => void;
	name: string;
	firstLabel: string;
	secondLabel: string;
}

export default function Toggle({
	isDisabled,
	handleChange,
	name,
	firstLabel,
	secondLabel,
}: ToggleProps) {
	return (
		<div className={styles.toggleButtons}>
			<p className={styles.firstHeader}>{firstLabel}</p>
			<label className={styles.toggleBackground} htmlFor={name}>
				<input
					type="checkbox"
					name={name}
					id={name}
					checked={!isDisabled}
					onChange={handleChange}
				/>
				<span className={styles.toggleSlider}></span>
			</label>
			<p className={styles.secondHeader}>{secondLabel}</p>
		</div>
	);
}
