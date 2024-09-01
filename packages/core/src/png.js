/**
 * @license
 *
 * This code is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * See the LICENSE file for details.
 * Full license text: https://creativecommons.org/licenses/by/4.0/
 * Copyright (c) 2024 Aaron Ragudos
 */

/**
 * @fileoverview ALl PNG related operations are in this file.
 * @module core/png
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

/**
 * Handles PNG files
 */
class PNG {
	/**
	 * @type {Uint8Array}
	 */
	rawData;

	/**
	 * @param {Uint8Array} rawData
	 *
	 * @throws {TypeError} if invalid Uint8Array data is received
	 */
	constructor(rawData) {
		for (let i = 0; i < PNG_SIGNATURE.length; ++i) {
			if (rawData[i] !== PNG_SIGNATURE[i]) {
				throw new TypeError();
			}
		}

		this.rawData = rawData;
	}
}

module.exports = { PNG_SIGNATURE, PNG };
