/**
 * @license
 *
 * This code is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * See the LICENSE file for details.
 * Full license text: https://creativecommons.org/licenses/by/4.0/
 * Copyright (c) 2024 Aaron Ragudos
 */

/**
 * @fileoverview The PNG header chunk class
 *
 * @module core/png/header
 */

const { assert, bytesTo32BitUint, isNumber } = require("@image-parser/utils");
const PngChunk = require("./chunk");
const { CHARACTER_ASCII_CODES, PNG_COLOR_TYPES } = require("src/const");

class PngHeader {
	/**
	 * @type {PngChunk}
	 */
	#chunk;
	/**
	 * @type {number}
	 */
	#width;
	/**
	 * @type {number}
	 */
	#height;
	/**
	 * @type {number}
	 */
	#bitDepth;
	/**
	 * @type {number}
	 */
	#colorType;
	/**
	 * @type {number}
	 */
	#compressionMethod;
	/**
	 * @type {number}
	 */
	#filterMethod;
	/**
	 * @type {number}
	 */
	#interlaceMethd;

	/**
	 * @type {number}
	 */
	#bpp;

	/**
	 * @type {number}
	 * The real width of the image
	 * Width * bpp
	 */
	#realWidth;

	static HEADER_LENGTH = 13;

	/**
	 * @param {PngChunk} chunk
	 */
	constructor(chunk) {
		this.#chunk = chunk;

		assert(this.#chunk.chunkData.length > 0, "No chunk data found.");
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

	get interlaceMethod() {
		return this.#interlaceMethd;
	}

	get bpp() {
		return this.#bpp;
	}

	get realWidth() {
		return this.#realWidth;
	}

	/**
	 * @returns {boolean}
	 */
	#isChunkDataHeader() {
		return (
			this.#chunk.chunkAncillaryValue === CHARACTER_ASCII_CODES.I &&
			this.#chunk.chunkPrivacyValue === CHARACTER_ASCII_CODES.H &&
			this.#chunk.chunkReservedValue === CHARACTER_ASCII_CODES.D &&
			this.#chunk.chunkSafeToCopyValue === CHARACTER_ASCII_CODES.R
		);
	}

	#parseHeader() {
		this.#width = bytesTo32BitUint(
			this.#chunk.chunkData[0],
			this.#chunk.chunkData[1],
			this.#chunk.chunkData[2],
			this.#chunk.chunkData[3]
		);
		this.#height = bytesTo32BitUint(
			this.#chunk.chunkData[4],
			this.#chunk.chunkData[5],
			this.#chunk.chunkData[6],
			this.#chunk.chunkData[7]
		);
		this.#bitDepth = this.#chunk.chunkData[8];
		this.#colorType = this.#chunk.chunkData[9];
		this.#compressionMethod = this.#chunk.chunkData[10];
		this.#filterMethod = this.#chunk.chunkData[11];
		this.#interlaceMethd = this.#chunk.chunkData[12];
		this.#bpp = this.#calculateBPP();
		this.#realWidth = this.#width * this.#bpp;
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

	/**
	 * @returns {number}
	 */
	#calculateBPP() {
		switch (this.colorType) {
			case 0:
				return this.bitDepth / 8;

			case 2:
				return 3 * (this.bitDepth / 8);

			case 3:
				return 1;

			case 4:
				return 2 * (this.bitDepth / 8);

			case 6:
				return 4 * (this.bitDepth / 8);

			default:
				throw new Error("Invalid color type.");
		}
	}
}

module.exports = PngHeader;
