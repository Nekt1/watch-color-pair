import type { LabValue } from "../types";

export function calculateDistance(color: LabValue, matchColor: LabValue) {
	const deltaL = color.L - matchColor.L;
	const deltaA = color.a - matchColor.a;
	const deltaB = color.b - matchColor.b;
	return parseFloat(
		Math.sqrt(deltaL ** 2 + deltaA ** 2 + deltaB ** 2).toFixed(2),
	);
}
