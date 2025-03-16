const { bytesTo32BitUint, getBitAt } = require("@image-parser/utils");
const { CRC } = require("src/crc");

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
	 * @type {number} chunkLength
	 */
	// @ts-ignore
	#chunkLength;
	/**
	 * @type {number}
	 */
	// @ts-ignore
	#chunkAncillaryValue;
	/**
	 * @type {number}
	 */
	// @ts-ignore
	#chunkAncillaryBit;
	/**
	 * @type {number}
	 */
	// @ts-ignore
	#chunkPrivacyValue;
	/**
	 * @type {number}
	 */
	// @ts-ignore
	#chunkPrivacyBit;
	/**
	 * @type {number}
	 */
	// @ts-ignore
	#chunkReservedValue;
	/**
	 * @type {number}
	 */
	// @ts-ignore
	#chunkReservedBit;
	/**
	 * @type {number}
	 */
	// @ts-ignore
	#chunkSafeToCopyValue;
	/**
	 * @type {number}
	 */
	// @ts-ignore
	#chunkSafeToCopyBit;
	/**
	 * @param {Uint8Array} chunkData
	 */
	// @ts-ignore
	#chunkData;
	/**
	 * @param {number} chunkCRC
	 */
	// @ts-ignore
	#chunkCRC;

	/**
	 * @param {number} chunkCalculatedCRC
	 */
	// @ts-ignore
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

	get chunkPrivacyBit() {
		return this.#chunkPrivacyBit;
	}

	get chunkReservedBit() {
		return this.#chunkReservedBit;
	}

	get chunkSafeToCopyBit() {
		return this.#chunkSafeToCopyBit;
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

	#calculateCRC() {
		const calculatedCRC = CRC.calculateCRC(this.#chunkData);

		return calculatedCRC;
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
	}

	#assignChunkData() {
		this.#chunkData = this.#chunkRawData.slice(
			this.#chunkPositionOffset + 8,
			this.#chunkPositionOffset + 8 + this.#chunkLength
		);
	}

	#assignChunkCRC() {
		this.#chunkCRC = bytesTo32BitUint(
			this.#chunkRawData[
				this.#chunkPositionOffset + 8 + this.#chunkLength
			],
			this.#chunkRawData[
				this.#chunkPositionOffset + 8 + this.#chunkLength + 1
			],
			this.#chunkRawData[
				this.#chunkPositionOffset + 8 + this.#chunkLength + 2
			],
			this.#chunkRawData[
				this.#chunkPositionOffset + 8 + this.#chunkLength + 3
			]
		);

		this.#chunkCalculatedCRC = this.#calculateCRC();
	}
}

module.exports = PngChunk;
