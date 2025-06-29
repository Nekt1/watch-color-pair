export type Season = "autumn" | "winter" | "spring" | "summer";

export type Color = {
	name: string;
	lab: LabValue;
	year: number;
	season: Season;
	deltaE: number;
};

// TODO
// maybe can just use Color with LabValue[] instead and not split

export type DualColor = Omit<Color, "lab"> & {
	parts: LabValue[];
};

export type LabValue = {
	L: number;
	a: number;
	b: number;
};

export type Image = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export interface ButtonProps {
	onClick: () => void;
	isDisabled: boolean;
	children: React.ReactNode;
}
