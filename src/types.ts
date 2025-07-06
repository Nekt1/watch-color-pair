export type Season = "autumn" | "winter" | "spring" | "summer";

export type Color = {
	name: string;
	lab: LabValue;
	year: number;
	season: Season;
	deltaE: number;
};

// TODOish
// could maybe have just used Color type and lab set to LabValue[] always, then check for length. 
// also probably should split types into separate files
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
