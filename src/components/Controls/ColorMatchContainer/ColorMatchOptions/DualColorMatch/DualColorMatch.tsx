import styles from "./dualColorMatch.module.scss";
import type { DualColor } from "../../../../../types";
import {
	calculateContrast,
	labToRgb,
} from "../../../../../utils/colorConversions";
import { capitalize } from "../../../../../utils/capitalize";

export default function DualColorMatch({
	name,
	parts,
	year,
	season,
}: DualColor) {
	const [labFirstHalf, labSecondHalf] = parts;
	const rgbFirstHalf = labToRgb(labFirstHalf.L, labFirstHalf.a, labFirstHalf.b);
	const contrast = calculateContrast(
		rgbFirstHalf.r,
		rgbFirstHalf.g,
		rgbFirstHalf.b,
	);
	const labFirstColor = `lab(${labFirstHalf.L} ${labFirstHalf.a} ${labFirstHalf.b})`;
	const labSecondColor = `lab(${labSecondHalf.L} ${labSecondHalf.a} ${labSecondHalf.b})`;
	return (
		<div className={styles.colorMatchContainer} style={{ color: contrast }}>
			<div
				className={styles.firstHalf}
				style={{ backgroundColor: labFirstColor }}
			></div>
			<div
				className={styles.secondHalf}
				style={{ backgroundColor: labSecondColor }}
			></div>
			<p className={styles.matchText}>
				{capitalize(name)} ({capitalize(season)} {year})
			</p>
		</div>
	);
}
