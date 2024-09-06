/**
 * @license
 *
 * This code is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * See the LICENSE file for details.
 * Full license text: https://creativecommons.org/licenses/by/4.0/
 * Copyright (c) 2024 Aaron Ragudos
 */

/**
 * A PNG file will always have this first 8 bytes.
 *
 * In *decimal (base-10)*, it looks like:
 *
 * ```javascript
 * [137, 80, 78, 71, 13, 10, 26, 10]
 * ```
 * @see http://www.libpng.org/pub/png/spec/1.2/PNG-Structure.html
 */
const PNG_SIGNATURE = Object.freeze([
	0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

const CHARACTER_ASCII_CODES = Object.freeze({
	I: 73,
	H: 72,
	D: 68,
	E: 69,
	A: 65,
	R: 82,
	L: 76,
	N: 78,
	P: 80,
	T: 84,
});

const PNG_COLOR_TYPES = Object.freeze({
	grayscale: 0,
	rgb: 2,
	plte: 3,
	grayscaleAlpha: 4,
	rgbAlpha: 6,
});

module.exports = { CHARACTER_ASCII_CODES, PNG_SIGNATURE, PNG_COLOR_TYPES };
