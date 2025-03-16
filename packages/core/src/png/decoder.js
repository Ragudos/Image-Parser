const { PNG_SIGNATURE } = require("src/const");
const PngChunk = require("./chunk");
const { assert } = require("@image-parser/utils");
const PngHeader = require("./header");

class PngDecoder {
	/**
	 *
	 * @param {Uint8Array} rawData
	 */
	#rawData;
	/**
	 * @type {Array<PngChunk>}
	 */
	#pngChunks;
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

		this.#pngChunks = this.#initPngChunks();
		this.#pngHeader = new PngHeader(this.#pngChunks);
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

	getPNGChunks() {
		return this.#pngChunks;
	}

	getPNGHeader() {
		return this.#pngHeader;
	}

	/**
	 * @returns {Array<PngChunk>}
	 */
	#initPngChunks() {
		let offset = 8;
		const chunks = [];

		while (offset < this.#rawData.length) {
			const chunk = new PngChunk(offset, this.#rawData.slice(offset));

			chunks.push(chunk);
			offset += chunk.chunkLength + 12;
		}

		return chunks;
	}
}

module.exports = PngDecoder;
