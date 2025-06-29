import styles from "./colorMatch.module.scss";
import type { Color } from "../../../../../types";
import {
	calculateContrast,
	labToRgb,
} from "../../../../../utils/colorConversions";
import { capitalize } from "../../../../../utils/capitalize";

export default function ColorMatch({ name, lab, year, season }: Color) {
	const rgb = labToRgb(lab.L, lab.a, lab.b);
	const contrast = calculateContrast(rgb.r, rgb.g, rgb.b);
	const labColor = `lab(${lab.L} ${lab.a} ${lab.b})`;
	return (
		<div
			className={styles.colorMatchContainer}
			style={{ backgroundColor: labColor, color: contrast }}
		>
			<p className={styles.matchText}>
				{capitalize(name)} ({capitalize(season)} {year})
			</p>
		</div>
	);
}
