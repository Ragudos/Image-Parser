/**
 * @license
 *
 * This code is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * See the LICENSE file for details.
 * Full license text: https://creativecommons.org/licenses/by/4.0/
 * Copyright (c) 2024 Aaron Ragudos
 */

/**
 * @fileoverview The PNG chunk class
 *
 * @module core/png/chunk
 */

const { bytesTo32BitUint, getBitAt } = require("@image-parser/utils");
const {
	CHARACTER_ASCII_CODES,
	MIN_LOWERCASE_CHARACTER_ASCII_CODE,
	MAX_LOWERCASE_CHARACTER_ASCII_CODE,
	MIN_UPPERCASE_CHARACTER_ASCII_CODE,
	MAX_UPPERCASE_CHARACTER_ASCII_CODE,
} = require("src/const");
const { CRC } = require("src/crc");
const PngHeader = require("./header");

/**
 * @class PngChunk
 */
class PngChunk {
	/**
	 * @type {number}
	 */
	#chunkPositionOffset;
	/**
	 * @type {Uint8Array}
	 */
	#chunkRawData;
	/**
	 * @type {number}
	 */
	#chunkLength;
	/**
	 * @type {number}
	 */
	#chunkAncillaryValue;
	/**
	 * @type {number}
	 */
	#chunkAncillaryBit;
	/**
	 * @type {number}
	 */
	#chunkPrivacyValue;
	/**
	 * @type {number}
	 */
	#chunkPrivacyBit;
	/**
	 * @type {number}
	 */
	#chunkReservedValue;
	/**
	 * @type {number}
	 */
	#chunkReservedBit;
	/**
	 * @type {number}
	 */
	#chunkSafeToCopyValue;
	/**
	 * @type {number}
	 */
	#chunkSafeToCopyBit;
	/**
	 * @type {Uint8Array}
	 */
	#chunkData;
	/**
	 * @type {number}
	 */
	#chunkCRC;
	/**
	 * @type {number}
	 */
	#chunkCalculatedCRC;

	/**
	 * @param {number} chunkPositionOffset
	 * @param {Uint8Array} chunkRawData
	 */
	constructor(chunkPositionOffset, chunkRawData) {
		this.#chunkPositionOffset = chunkPositionOffset;
		this.#chunkRawData = chunkRawData;

		this.#assignChunkLength();
		this.#assignChunkType();
		this.#assignChunkData();
		this.#assignChunkCRC();
	}

	get chunkLength() {
		return this.#chunkLength;
	}

	get chunkData() {
		return this.#chunkData;
	}

	get chunkCRC() {
		return this.#chunkCRC;
	}

	get chunkCalculatedCRC() {
		return this.#chunkCalculatedCRC;
	}

	get chunkAncillaryBit() {
		return this.#chunkAncillaryBit;
	}

	get chunkAncillaryValue() {
		return this.#chunkAncillaryValue;
	}

	get chunkPrivacyBit() {
		return this.#chunkPrivacyBit;
	}

	get chunkPrivacyValue() {
		return this.#chunkPrivacyValue;
	}

	get chunkReservedBit() {
		return this.#chunkReservedBit;
	}

	get chunkReservedValue() {
		return this.#chunkReservedValue;
	}

	get chunkSafeToCopyBit() {
		return this.#chunkSafeToCopyBit;
	}

	get chunkSafeToCopyValue() {
		return this.#chunkSafeToCopyValue;
	}

	isCritical() {
		return this.#chunkAncillaryBit === 0;
	}

	isPublic() {
		return this.#chunkPrivacyBit === 0;
	}

	isReservedBitValid() {
		return this.#chunkReservedBit === 0;
	}

	isSafeToCopy() {
		return this.#chunkSafeToCopyBit === 1;
	}

	isCorrupted() {
		return this.#chunkCRC !== this.#chunkCalculatedCRC;
	}

	isSafe() {
		return (
			!this.isCorrupted() &&
			this.isSafeToCopy() &&
			this.isReservedBitValid() &&
			this.isPublic() &&
			this.isCritical()
		);
	}

	isIHDR() {
		return (
			this.#chunkRawData[this.#chunkPositionOffset + 4] ===
				CHARACTER_ASCII_CODES.I &&
			this.#chunkRawData[this.#chunkPositionOffset + 5] ===
				CHARACTER_ASCII_CODES.H &&
			this.#chunkRawData[this.#chunkPositionOffset + 6] ===
				CHARACTER_ASCII_CODES.D &&
			this.#chunkRawData[this.#chunkPositionOffset + 7] ===
				CHARACTER_ASCII_CODES.R
		);
	}

	isPLTE() {
		return (
			this.#chunkRawData[this.#chunkPositionOffset + 4] ===
				CHARACTER_ASCII_CODES.P &&
			this.#chunkRawData[this.#chunkPositionOffset + 5] ===
				CHARACTER_ASCII_CODES.L &&
			this.#chunkRawData[this.#chunkPositionOffset + 6] ===
				CHARACTER_ASCII_CODES.T &&
			this.#chunkRawData[this.#chunkPositionOffset + 7] ===
				CHARACTER_ASCII_CODES.E
		);
	}

	isIDAT() {
		return (
			this.#chunkRawData[this.#chunkPositionOffset + 4] ===
				CHARACTER_ASCII_CODES.I &&
			this.#chunkRawData[this.#chunkPositionOffset + 5] ===
				CHARACTER_ASCII_CODES.D &&
			this.#chunkRawData[this.#chunkPositionOffset + 6] ===
				CHARACTER_ASCII_CODES.A &&
			this.#chunkRawData[this.#chunkPositionOffset + 7] ===
				CHARACTER_ASCII_CODES.T
		);
	}

	isIEND() {
		return (
			this.#chunkRawData[this.#chunkPositionOffset + 4] ===
				CHARACTER_ASCII_CODES.I &&
			this.#chunkRawData[this.#chunkPositionOffset + 5] ===
				CHARACTER_ASCII_CODES.E &&
			this.#chunkRawData[this.#chunkPositionOffset + 6] ===
				CHARACTER_ASCII_CODES.N &&
			this.#chunkRawData[this.#chunkPositionOffset + 7] ===
				CHARACTER_ASCII_CODES.D
		);
	}

	isAncillaryValid() {
		return (
			(this.#chunkAncillaryValue >= MIN_LOWERCASE_CHARACTER_ASCII_CODE &&
				this.#chunkAncillaryValue <=
					MAX_LOWERCASE_CHARACTER_ASCII_CODE) ||
			(this.#chunkAncillaryValue >= MIN_UPPERCASE_CHARACTER_ASCII_CODE &&
				this.#chunkAncillaryValue <= MAX_UPPERCASE_CHARACTER_ASCII_CODE)
		);
	}

	isPrivacyValid() {
		return (
			(this.#chunkPrivacyValue >= MIN_LOWERCASE_CHARACTER_ASCII_CODE &&
				this.#chunkPrivacyValue <=
					MAX_LOWERCASE_CHARACTER_ASCII_CODE) ||
			(this.#chunkPrivacyValue >= MIN_UPPERCASE_CHARACTER_ASCII_CODE &&
				this.#chunkPrivacyValue <= MAX_UPPERCASE_CHARACTER_ASCII_CODE)
		);
	}

	isReservedValid() {
		return (
			(this.#chunkReservedValue >= MIN_LOWERCASE_CHARACTER_ASCII_CODE &&
				this.#chunkReservedValue <=
					MAX_LOWERCASE_CHARACTER_ASCII_CODE) ||
			(this.#chunkReservedValue >= MIN_UPPERCASE_CHARACTER_ASCII_CODE &&
				this.#chunkReservedValue <= MAX_UPPERCASE_CHARACTER_ASCII_CODE)
		);
	}

	isSafeToCopyValid() {
		return (
			(this.#chunkSafeToCopyValue >= MIN_LOWERCASE_CHARACTER_ASCII_CODE &&
				this.#chunkSafeToCopyValue <=
					MAX_LOWERCASE_CHARACTER_ASCII_CODE) ||
			(this.#chunkSafeToCopyValue >= MIN_UPPERCASE_CHARACTER_ASCII_CODE &&
				this.#chunkSafeToCopyValue <=
					MAX_UPPERCASE_CHARACTER_ASCII_CODE)
		);
	}

	isChunkTypeValid() {
		return (
			this.isAncillaryValid() &&
			this.isPrivacyValid() &&
			this.isReservedValid() &&
			this.isSafeToCopyValid()
		);
	}

	throwIfInvalidChunk() {
		if (this.#chunkPositionOffset === 8) {
			if (!this.isIHDR()) {
				throw new Error("Invalid PNG file.");
			} else if (this.#chunkLength !== PngHeader.HEADER_LENGTH) {
				throw new Error("Invalid IHDR chunk length.");
			}
		}

		if (!this.isChunkTypeValid()) {
			throw new Error("Invalid chunk type.");
		}
	}

	#calculateCRC() {
		return (
			CRC.calculateCRC(
				this.#chunkRawData.slice(
					this.#chunkPositionOffset + 4,
					this.#chunkPositionOffset + 8 + this.#chunkLength
				)
			) >>> 0
		);
	}

	#assignChunkLength() {
		this.#chunkLength = bytesTo32BitUint(
			this.#chunkRawData[this.#chunkPositionOffset],
			this.#chunkRawData[this.#chunkPositionOffset + 1],
			this.#chunkRawData[this.#chunkPositionOffset + 2],
			this.#chunkRawData[this.#chunkPositionOffset + 3]
		);
	}

	#assignChunkType() {
		this.#chunkAncillaryValue =
			this.#chunkRawData[this.#chunkPositionOffset + 4];
		this.#chunkAncillaryBit = getBitAt(this.#chunkAncillaryValue, 5);
		this.#chunkPrivacyValue =
			this.#chunkRawData[this.#chunkPositionOffset + 5];
		this.#chunkPrivacyBit = getBitAt(this.#chunkPrivacyValue, 5);
		this.#chunkReservedValue =
			this.#chunkRawData[this.#chunkPositionOffset + 6];
		this.#chunkReservedBit = getBitAt(this.#chunkReservedValue, 5);
		this.#chunkSafeToCopyValue =
			this.#chunkRawData[this.#chunkPositionOffset + 7];
		this.#chunkSafeToCopyBit = getBitAt(this.#chunkSafeToCopyValue, 5);

		this.throwIfInvalidChunk();
	}

	#assignChunkData() {
		const dataPositionOffset = this.#getChunkDataPositionOffset();

		this.#chunkData = this.#chunkRawData.slice(
			dataPositionOffset,
			dataPositionOffset + this.#chunkLength
		);
	}

	#assignChunkCRC() {
		const crcPositionOffset = this.#getCRCPositionOffset();

		this.#chunkCRC = bytesTo32BitUint(
			this.#chunkRawData[crcPositionOffset],
			this.#chunkRawData[crcPositionOffset + 1],
			this.#chunkRawData[crcPositionOffset + 2],
			this.#chunkRawData[crcPositionOffset + 3]
		);

		this.#chunkCalculatedCRC = this.#calculateCRC();
	}

	#getChunkDataPositionOffset() {
		return this.#chunkPositionOffset + 8;
	}

	#getCRCPositionOffset() {
		return this.#getChunkDataPositionOffset() + this.#chunkLength;
	}
}

module.exports = PngChunk;
