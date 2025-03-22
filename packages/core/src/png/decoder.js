/**
 * @license
 *
 * This code is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * See the LICENSE file for details.
 * Full license text: https://creativecommons.org/licenses/by/4.0/
 * Copyright (c) 2024 Aaron Ragudos
 */

/**
 * @fileoverview Responsible for decoding PNGs
 *
 * @module core/png/decoder
 */

const { PNG_SIGNATURE } = require("src/const");
const PngChunk = require("./chunk");
const { assert, flattenChunks } = require("@image-parser/utils");
const PngHeader = require("./header");
const { inflate } = require("pako");
const PngData = require("./data");
const PngFilter = require("./filter");

class PngDecoder {
	/**
	 *
	 * @type{Uint8Array} rawData
	 */
	#rawData;
	/**
	 * @type {Array<PngChunk>}
	 */
	#pngChunks;
	/**
	 * @type {Array<PngChunk>}
	 */
	#pngIDATChunks;
	/**
	 * @type {PngHeader}
	 */
	#pngHeader;

	/**
	 *
	 * @param {Uint8Array} rawData
	 */
	constructor(rawData) {
		assert(rawData instanceof Uint8Array, "rawData must be a Uint8Array.");

		this.#rawData = rawData;

		assert(this.#rawData.length > 8, "PNG file is empty.");
		assert(this.isValidPNG(), "Not a valid PNG file.");

		this.#initPngChunks();

		this.#pngHeader = new PngHeader(this.#pngChunks[0]);

		this.#initPngIDATChunks();
	}

	get pngChunks() {
		return this.#pngChunks;
	}

	get pngHeader() {
		return this.#pngHeader;
	}

	get width() {
		return this.#pngHeader.width;
	}

	get height() {
		return this.#pngHeader.height;
	}

	get colorType() {
		return this.#pngHeader.colorType;
	}

	get bitDepth() {
		return this.#pngHeader.bitDepth;
	}

	get compressionMethod() {
		return this.#pngHeader.compressionMethod;
	}

	get filterMethod() {
		return this.#pngHeader.filterMethod;
	}

	get interlaceMethod() {
		return this.#pngHeader.interlaceMethod;
	}

	/**
	 * @returns {boolean}
	 */
	isValidPNG() {
		for (let i = 0, l = PNG_SIGNATURE.length; i < l; ++i) {
			if (this.#rawData[i] !== PNG_SIGNATURE[i]) {
				return false;
			}
		}

		return true;
	}

	/**
	 * @param {Uint8Array} plteChunkData
	 *
	 * @returns {boolean}
	 */
	isValidPLTE(plteChunkData) {
		return plteChunkData.length % 3 === 0;
	}

	decode() {
		const decompressedIDAT = this.#decompressIDATChunks();
		const decodedIDATChunks = PngFilter.reversePngFilter(
			decompressedIDAT,
			this.#pngHeader
		);

		return new PngData(
			this.#pngHeader,
			decodedIDATChunks,
			this.#getPlteChunk()
		);
	}

	#getPlteChunk() {
		for (let i = 1, l = this.#pngChunks.length; i < l; ++i) {
			const chunk = this.#pngChunks[i];

			if (chunk.isPLTE()) {
				if (
					chunk.chunkData.length >
					Math.pow(
						this.#pngHeader.colorType,
						this.#pngHeader.bitDepth
					)
				) {
					/**
					 *
					 * For color type 3 (indexed color), the PLTE chunk is required.
					 * The first entry in PLTE is referenced by pixel value 0, the second by pixel value 1, etc.
					 * The number of palette entries must not exceed the range that can be represented in the image bit depth
					 * (for example, 24 = 16 for a bit depth of 4). It is permissible to have fewer entries than the bit depth would allow.
					 * In that case, any out-of-range pixel value found in the image data is an error.
					 */
					throw new RangeError(
						"PLTE palette entries range more than the possible range a pixel can represent with colorType of " +
							this.#pngHeader.colorType +
							" and bit depth of " +
							this.#pngHeader.bitDepth
					);
				}

				return chunk.chunkData;
			}
		}

		return null;
	}

	#decompressIDATChunks() {
		return inflate(
			flattenChunks(this.#pngIDATChunks.map((idat) => idat.chunkData))
		);
	}

	#initPngChunks() {
		let offset = 8;

		this.#pngChunks = [];

		while (offset < this.#rawData.length) {
			const chunk = new PngChunk(offset, this.#rawData);

			if (chunk.isCorrupted()) {
				throw new Error("CRC mismatch.");
			}

			offset += chunk.chunkLength + 12;
			this.#pngChunks.push(chunk);
		}
	}

	#initPngIDATChunks() {
		this.#pngIDATChunks = [];

		for (let i = 1, l = this.#pngChunks.length; i < l; ++i) {
			const chunk = this.#pngChunks[i];

			if (chunk.isIDAT()) {
				this.#pngIDATChunks.push(chunk);
			} else if (!chunk.isIEND()) {
				if (
					this.#pngChunks[i + 1].isIDAT() &&
					this.#pngIDATChunks.length !== 0
				) {
					throw new Error("IDAT chunks must be consecutive.");
				}
			}
		}
	}
}

module.exports = PngDecoder;
