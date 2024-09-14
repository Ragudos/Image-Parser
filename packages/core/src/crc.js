/**
 * @license
 *
 * This code is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * See the LICENSE file for details.
 * Full license text: https://creativecommons.org/licenses/by/4.0/
 * Copyright (c) 2024 Aaron Ragudos
 */

const { MAX_UINT_32BIT, MAX_UINT_8BIT } = require("@image-parser/utils");

/**
 * @fileoverview Responsible for CRC calculations
 *
 * @module core/crc
 */

/**
 *
 * This implementation follows the shared code in:
 *
 * @see {@link http://www.libpng.org/pub/png/spec/1.2/PNG-CRCAppendix.html}
 */
class CRC {
	/** @type {boolean} */
	static #crcTableComputed = false;
	/** @type {Array<number>} */
	static #table = [];

	/**
	 *
	 * @returns {void}
	 */
	static #makeTable() {
		if (CRC.#crcTableComputed) {
			return;
		}

		// uint8
		for (let i = 0; i < 256; ++i) {
			let c = i;

			// 8-bit (uint8 has 8 bits)
			for (let j = 0; j < 8; ++j) {
				if (c & 1) {
					c = 0xedb88320 ^ (c >>> 1);
				} else {
					c = c >>> 1;
				}
			}

			CRC.#table[i] = c;
		}

		CRC.#crcTableComputed = true;
	}

	/**
	 *
	 * @param {number} crc
	 * @param {Uint8Array} buf
	 *
	 * @returns {number}
	 */
	static #updateCRC(crc, buf) {
		let c = crc;

		if (!CRC.#crcTableComputed) {
			CRC.#makeTable();
		}

		for (let i = 0; i < buf.length; ++i) {
			const index = (c ^ buf[i]) & MAX_UINT_8BIT;

			c = CRC.#table[index] ^ (c >>> 8);
		}

		return c;
	}

	/**
	 *
	 * @param {Uint8Array} buf
	 *
	 * @returns {number}
	 */
	static calculateCRC(buf) {
		return CRC.#updateCRC(MAX_UINT_32BIT, buf) ^ MAX_UINT_32BIT;
	}
}

module.exports = { CRC };
