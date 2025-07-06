import type { LabValue } from "../types";

// Helper function for gamma correction
function roundDown(num: number) {
	return parseFloat(num.toFixed(2));
}

function gammaCorrect(value: number) {
	return value > 0.04045
		? Math.pow((value + 0.055) / 1.055, 2.4)
		: value / 12.92;
}

function hexToRgb(hex: string) {
	let r = 0,
		g = 0,
		b = 0;
	if (hex.length === 7) {
		r = parseInt(hex.slice(1, 3), 16);
		g = parseInt(hex.slice(3, 5), 16);
		b = parseInt(hex.slice(5, 7), 16);
	} else if (hex.length === 4) {
		r = parseInt(hex[1] + hex[1], 16);
		g = parseInt(hex[2] + hex[2], 16);
		b = parseInt(hex[3] + hex[3], 16);
	}
	return { r, g, b };
}

// Helper function for XYZ to LAB conversion
function xyzToLab(value: number) {
	const epsilon = 216 / 24389; // 0.008856
	const kappa = 24389 / 27; // 903.3
	return value > epsilon ? Math.cbrt(value) : (kappa * value + 16) / 116;
}

// Main conversion function
function rgbToLab(r: number, g: number, b: number) {
	// Normalize RGB values to the range 0-1
	r /= 255;
	g /= 255;
	b /= 255;

	// Apply gamma correction
	r = gammaCorrect(r);
	g = gammaCorrect(g);
	b = gammaCorrect(b);

	// Convert to XYZ color space
	const X = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047;
	const Y = (r * 0.2126729 + g * 0.7151522 + b * 0.072175) / 1.0;
	const Z = (r * 0.0193339 + g * 0.119192 + b * 0.9503041) / 1.08883;

	// Convert XYZ to LAB
	const L = roundDown(116 * xyzToLab(Y) - 16);
	const a = roundDown(500 * (xyzToLab(X) - xyzToLab(Y)));
	const bLab = roundDown(200 * (xyzToLab(Y) - xyzToLab(Z)));
	return { L, a, b: bLab };
}

function rgbToHsl(r: number, g: number, b: number) {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;

	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (delta !== 0) {
		s = delta / (1 - Math.abs(2 * l - 1));

		switch (max) {
			case r:
				h = ((g - b) / delta) % 6;
				break;
			case g:
				h = (b - r) / delta + 2;
				break;
			case b:
				h = (r - g) / delta + 4;
				break;
		}

		h *= 60;
		if (h < 0) h += 360;
	}

	return {
		h: Math.round(h),
		s: +(s * 100).toFixed(1),
		l: +(l * 100).toFixed(1),
	};
}

function hslToRgb(h: number, s: number, l: number) {
	s /= 100;
	l /= 100;

	const c = (1 - Math.abs(2 * l - 1)) * s;
	const hPrime = h / 60;
	const x = c * (1 - Math.abs((hPrime % 2) - 1));
	let r1, g1, b1;

	if (hPrime >= 0 && hPrime < 1) {
		[r1, g1, b1] = [c, x, 0];
	} else if (hPrime >= 1 && hPrime < 2) {
		[r1, g1, b1] = [x, c, 0];
	} else if (hPrime >= 2 && hPrime < 3) {
		[r1, g1, b1] = [0, c, x];
	} else if (hPrime >= 3 && hPrime < 4) {
		[r1, g1, b1] = [0, x, c];
	} else if (hPrime >= 4 && hPrime < 5) {
		[r1, g1, b1] = [x, 0, c];
	} else {
		[r1, g1, b1] = [c, 0, x];
	}

	const m = l - c / 2;
	const r = Math.round((r1 + m) * 255);
	const g = Math.round((g1 + m) * 255);
	const b = Math.round((b1 + m) * 255);

	return { r, g, b };
}

function labToRgb(l: number, a: number, b: number) {
	// Step 1: Convert Lab to XYZ
	const delta = 6 / 29;
	const fy = (l + 16) / 116;
	const fx = fy + a / 500;
	const fz = fy - b / 200;

	const xr = fx > delta ? Math.pow(fx, 3) : (fx - 16 / 116) / 7.787;
	const yr = l > delta * 116 ? Math.pow((l + 16) / 116, 3) : l / 903.3;
	const zr = fz > delta ? Math.pow(fz, 3) : (fz - 16 / 116) / 7.787;

	const X = xr * 95.047;
	const Y = yr * 100.0;
	const Z = zr * 108.883;

	// Step 2: Convert XYZ to RGB
	let R = X * 0.032406 + Y * -0.015372 + Z * -0.004986;
	let G = X * -0.009689 + Y * 0.018758 + Z * 0.000415;
	let B = X * 0.000557 + Y * -0.00204 + Z * 0.01057;

	// Normalize RGB values
	R = R > 0.0031308 ? 1.055 * Math.pow(R, 1 / 2.4) - 0.055 : 12.92 * R;
	G = G > 0.0031308 ? 1.055 * Math.pow(G, 1 / 2.4) - 0.055 : 12.92 * G;
	B = B > 0.0031308 ? 1.055 * Math.pow(B, 1 / 2.4) - 0.055 : 12.92 * B;

	// Convert to 8-bit integer
	R = Math.min(Math.max(0, R * 255), 255);
	G = Math.min(Math.max(0, G * 255), 255);
	B = Math.min(Math.max(0, B * 255), 255);

	return {
		r: Math.round(R),
		g: Math.round(G),
		b: Math.round(B),
	};
}

function calculateContrast(r: number, g: number, b: number) {
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 128 ? "black" : "white";
}

function getComplementaryColor(labColor: LabValue) {
	const rgbColor = labToRgb(labColor.L, labColor.a, labColor.b);
	const hslColor = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b);
	const complementaryHue = (hslColor.h + 180) % 360;
	const convertedRgb = hslToRgb(complementaryHue, hslColor.s, hslColor.l);
	const convertedLab = rgbToLab(convertedRgb.r, convertedRgb.g, convertedRgb.b);
	return convertedLab;
}

export {
	hexToRgb,
	rgbToLab,
	labToRgb,
	calculateContrast,
	getComplementaryColor,
};
