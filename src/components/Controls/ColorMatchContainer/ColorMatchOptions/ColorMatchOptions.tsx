import styles from "./colorMatchOptions.module.scss";
import ColorMatch from "./ColorMatch/ColorMatch";
import type { Color, DualColor } from "../../../../types";
import DualColorMatch from "./DualColorMatch/DualColorMatch";

interface ColorMatchOptionsProps {
	topMatches: Color[] | DualColor[];
}

function isSingleColorArray(
	matches: (Color | DualColor)[],
): matches is Color[] {
	return matches.length > 0 && "lab" in matches[0];
}

function isDualColorArray(
	matches: (Color | DualColor)[],
): matches is DualColor[] {
	return matches.length > 0 && "parts" in matches[0];
}

export default function ColorMatchOptions({
	topMatches,
}: ColorMatchOptionsProps) {
	return (
		<div className={styles.colorResultsOptions}>
			{isSingleColorArray(topMatches) &&
				topMatches.map((match) => (
					<ColorMatch
						key={`${match.name}${match.year}${match.season}`}
						name={match.name}
						deltaE={match.deltaE}
						lab={match.lab}
						season={match.season}
						year={match.year}
					/>
				))}
			{isDualColorArray(topMatches) &&
				topMatches.map((match) => (
					<DualColorMatch
						key={`${match.name}${match.year}${match.season}`}
						name={match.name}
						deltaE={match.deltaE}
						parts={match.parts}
						season={match.season}
						year={match.year}
					/>
				))}
		</div>
	);
}
