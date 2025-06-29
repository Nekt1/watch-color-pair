import type { Color, DualColor, LabValue, Season } from "../types";
import data from "../data/colors.json";
import { calculateDistance } from "./calculateDistance";

export function singleColorFilter(color: LabValue) {
	const matchColors = data.singleColor.colors;
	const deltas: Color[] = [];
	matchColors.forEach((matchColor) => {
		const deltaE = calculateDistance(color, matchColor.lab);
		deltas.push({
			name: matchColor.name,
			deltaE: deltaE,
			lab: matchColor.lab,
			season: matchColor.season as Season,
			year: matchColor.year,
		});
	});
	return deltas;
}

export function dualColorFilter(color: LabValue) {
	const matchColors = data.dualColor.colors;
	const deltas: DualColor[] = [];
	matchColors.forEach((matchColor) => {
		const deltaE1 = calculateDistance(color, matchColor.parts[0]);
		const deltaE2 = calculateDistance(color, matchColor.parts[1]);
		const deltaE = parseFloat((deltaE1 + deltaE2).toFixed(2));
		deltas.push({
			name: matchColor.name,
			deltaE: deltaE,
			parts: [...matchColor.parts],
			season: matchColor.season as Season,
			year: matchColor.year,
		});
	});
	return deltas;
}

export function deltaFilter(a: Color | DualColor, b: Color | DualColor) {
	if (a.deltaE > b.deltaE) {
		return 1;
	}
	if (a.deltaE < b.deltaE) {
		return -1;
	}
	return 0;
}
