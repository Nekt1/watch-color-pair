import styles from "./colorMatchHeader.module.scss";
import type { LabValue } from "../../../../types";

export default function ColorMatchHeader({ color }: { color: LabValue }) {
	const labColor = `lab(${color.L} ${color.a} ${color.b})`;
	return (
		<div className={styles.colorResultsHeader}>
			<p className={styles.colorResultsText}>Your color: </p>
			<p className={styles.selectedColor} style={{ backgroundColor: labColor }}>
				&nbsp;
			</p>
		</div>
	);
}
