// Helper function for gamma correction
function roundDown(num: number) {
	return parseFloat(num.toFixed(2));
}

function gammaCorrect(value: number) {
	return value > 0.04045
		? Math.pow((value + 0.055) / 1.055, 2.4)
		: value / 12.92;
}

// Helper function for XYZ to LAB conversion
function xyzToLab(value: number) {
	const epsilon = 216 / 24389; // 0.008856
	const kappa = 24389 / 27; // 903.3
	return value > epsilon ? Math.cbrt(value) : (kappa * value + 16) / 116;
}

// Main conversion function
export function rgbToLab(r: number, g: number, b: number) {
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

export function labToXyz(L: number, a: number, b: number) {
	const y = (L + 16) / 116;
	const x = a / 500 + y;
	const z = y - b / 200;

	const [x3, y3, z3] = [x ** 3, y ** 3, z ** 3];
	const epsilon = 0.008856; // actual CIE standard
	const kappa = 903.3;

	const xr = x3 > epsilon ? x3 : (116 * x - 16) / kappa;
	const yr = L > kappa * epsilon ? y3 : L / kappa;
	const zr = z3 > epsilon ? z3 : (116 * z - 16) / kappa;

	// Reference white D65
	const X = xr * 95.047;
	const Y = yr * 100.0;
	const Z = zr * 108.883;

	return { X, Y, Z };
}

export function xyzToRgb(X: number, Y: number, Z: number) {
	// Observer= 2°, Illuminant= D65
	let r = X * 0.032406 + Y * -0.015372 + Z * -0.004986;
	let g = X * -0.009689 + Y * 0.018758 + Z * 0.000415;
	let b = X * 0.000557 + Y * -0.00204 + Z * 0.01057;

	// Apply reverse gamma correction
	const gammaCorrect = (c: number) => {
		c = c / 100; // scale back
		return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
	};

	r = gammaCorrect(r);
	g = gammaCorrect(g);
	b = gammaCorrect(b);

	// Clamp to [0, 1] and scale to [0, 255]
	const clamp = (x: number) => Math.min(Math.max(0, x), 1) * 255;

	return {
		r: clamp(r),
		g: clamp(g),
		b: clamp(b),
	};
}

export function labToRgb(l, a, b) {
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

export function calculateContrast(r: number, g: number, b: number) {
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 128 ? "black" : "white";
}
