const { assert, bytesTo32BitUint, isNumber } = require("@image-parser/utils");
const PngChunk = require("./chunk");
const { CHARACTER_ASCII_CODES, PNG_COLOR_TYPES } = require("src/const");

class PngHeader {
	/**
	 * @type {Array<PngChunk>}
	 */
	#chunkData;

	/**
	 * @type {number}
	 */
	// @ts-ignore
	#width;
	/**
	 * @type {number}
	 */
	// @ts-ignore
	#height;
	/**
	 * @type {number}
	 */
	// @ts-ignore
	#bitDepth;
	/**
	 * @type {number}
	 */
	// @ts-ignore
	#colorType;
	/**
	 * @type {number}
	 */
	// @ts-ignore
	#compressionMethod;
	/**
	 * @type {number}
	 */
	// @ts-ignore
	#filterMethod;
	/**
	 * @type {number}
	 */
	// @ts-ignore
	#interlaceMethd;

	/**
	 * @param {Array<PngChunk>} chunkData
	 */
	constructor(chunkData) {
		this.#chunkData = chunkData;

		assert(this.#chunkData.length > 0, "No chunks found.");
		assert(this.#isChunkDataHeader(), "Chunk data is not a header.");

		this.#parseHeader();

		// @ts-ignore
		assert(this.#width > 0, "Width must be greater than 0.");
		// @ts-ignore
		assert(this.#height > 0, "Height must be greater than 0.");
		assert(
			this.#isValidBitDepthAndColorType(),
			"Invalid bit depth or color type."
		);
	}

	get width() {
		return this.#width;
	}

	get height() {
		return this.#height;
	}

	get bitDepth() {
		return this.#bitDepth;
	}

	get colorType() {
		return this.#colorType;
	}

	get compressionMethod() {
		return this.#compressionMethod;
	}

	get filterMethod() {
		return this.#filterMethod;
	}

	get interlaceMethd() {
		return this.#interlaceMethd;
	}

	/**
	 * @returns {boolean}
	 */
	#isChunkDataHeader() {
		const firstChunk = this.#chunkData[0];

		return (
			firstChunk.chunkAncillaryBit === CHARACTER_ASCII_CODES.I &&
			firstChunk.chunkPrivacyBit === CHARACTER_ASCII_CODES.H &&
			firstChunk.chunkReservedBit === CHARACTER_ASCII_CODES.D &&
			firstChunk.chunkSafeToCopyBit === CHARACTER_ASCII_CODES.R
		);
	}

	#parseHeader() {
		const headerChunk = this.#chunkData[0];

		this.#width = bytesTo32BitUint(
			headerChunk.chunkData[0],
			headerChunk.chunkData[1],
			headerChunk.chunkData[2],
			headerChunk.chunkData[3]
		);
		this.#height = bytesTo32BitUint(
			headerChunk.chunkData[4],
			headerChunk.chunkData[5],
			headerChunk.chunkData[6],
			headerChunk.chunkData[7]
		);
		this.#bitDepth = headerChunk.chunkData[8];
		this.#colorType = headerChunk.chunkData[9];
		this.#compressionMethod = headerChunk.chunkData[10];
		this.#filterMethod = headerChunk.chunkData[11];
		this.#interlaceMethd = headerChunk.chunkData[12];
	}

	/**
	 * @returns {boolean}
	 */
	#isValidBitDepthAndColorType() {
		if (!isNumber(this.#bitDepth) || !isNumber(this.#colorType)) {
			return false;
		}

		switch (this.#colorType) {
			case PNG_COLOR_TYPES.grayscale:
				return (
					this.#bitDepth === 1 ||
					this.#bitDepth === 2 ||
					this.#bitDepth === 4 ||
					this.#bitDepth === 8 ||
					this.#bitDepth === 16
				);

			case PNG_COLOR_TYPES.rgb:
				return this.#bitDepth === 8 || this.#bitDepth === 16;

			case PNG_COLOR_TYPES.plte:
				return (
					this.#bitDepth === 1 ||
					this.#bitDepth === 2 ||
					this.#bitDepth === 4 ||
					this.#bitDepth === 8
				);

			case PNG_COLOR_TYPES.grayscaleAlpha:
				return this.#bitDepth === 8 || this.#bitDepth === 16;

			case PNG_COLOR_TYPES.rgbAlpha:
				return this.#bitDepth === 8 || this.#bitDepth === 16;

			default:
				return false;
		}
	}
}

module.exports = PngHeader;
