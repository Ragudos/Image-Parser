const { PNG_SIGNATURE } = require("src/const");
const PngChunk = require("./chunk");
const { assert, flattenChunks, MAX_UINT_8BIT } = require("@image-parser/utils");
const PngHeader = require("./header");
const { inflate } = require("pako");

class PngData {
	/**
	 * @type {PngHeader}
	 */
	#header;
	/**
	 * @type {Uint8Array}
	 */
	#data;
	/**
	 * @type {Uint8Array | null}
	 */
	#plte;

	/**
	 * @param {PngHeader} header
	 * @param {Uint8Array} data
	 * @param {Uint8Array | null} plte
	 */
	constructor(header, data, plte) {
		this.#header = header;
		this.#data = data;
		this.#plte = plte;
	}

	get header() {
		return this.#header;
	}

	get data() {
		return this.#data;
	}

	get plte() {
		return this.#plte;
	}
}

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
		const bpp = this.#getBpp();
		const columnLength = this.#pngHeader.width * bpp;

		const decodedIDATChunks = this.#decodeFilter(
			decompressedIDAT,
			columnLength,
			bpp
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

	/**
	 * @param {number} a
	 * @param {number} b
	 * @param {number} c
	 *
	 * @returns {number}
	 */
	#paethPredictor(a, b, c) {
		const p = a + b - c;
		const pa = Math.abs(p - a);
		const pb = Math.abs(p - b);
		const pc = Math.abs(p - c);

		if (pa <= pb && pa <= pc) {
			return a;
		}

		if (pb <= pc) {
			return b;
		}

		return c;
	}

	/**
	 * @param {Uint8Array} row
	 * @param {Uint8Array | undefined} prevDecodedRow
	 * @param {number} bpp
	 *
	 * @returns {Uint8Array}
	 */
	#decodePaethFilter(row, prevDecodedRow, bpp) {
		for (let x = 0, l = row.length; x < l; ++x) {
			const prior = prevDecodedRow ? prevDecodedRow[x] : 0;
			const raw = x < bpp ? row[x] : row[x - bpp];
			const priorRaw = prevDecodedRow
				? x < bpp
					? 0
					: prevDecodedRow[x - bpp]
				: 0;

			row[x] = row[x] + this.#paethPredictor(raw, prior, priorRaw);
		}

		return row;
	}

	/**
	 * @param {Uint8Array} row
	 * @param {Uint8Array | undefined} prevDecodedRow
	 * @param {number} bpp
	 *
	 * @returns {Uint8Array}
	 */
	#decodeAverageFilter(row, prevDecodedRow, bpp) {
		for (let x = 0, l = row.length; x < l; ++x) {
			const prior = prevDecodedRow ? prevDecodedRow[x] : 0;
			const raw = x < bpp ? row[x] : row[x - bpp];

			row[x] = row[x] + Math.floor(raw + prior) / 2;
		}

		return row;
	}

	/**
	 * @param {Uint8Array} row
	 * @param {Uint8Array | undefined} prevDecodedRow
	 *
	 * @returns {Uint8Array}
	 */
	#decodeUpFilter(row, prevDecodedRow) {
		for (let x = 0, l = row.length; x < l; ++x) {
			row[x] =
				(row[x] + (prevDecodedRow ? prevDecodedRow[x] : 0)) %
				MAX_UINT_8BIT;
		}

		return row;
	}

	/**
	 * @param {Uint8Array} row
	 * @param {number} bpp
	 *
	 * @returns {Uint8Array}
	 */
	#decodeSubFilter(row, bpp) {
		for (let x = 0, l = row.length; x < l; ++x) {
			if (x >= bpp) {
				row[x] = (row[x] + row[x - bpp]) % MAX_UINT_8BIT;
			}
		}

		return row;
	}

	/**
	 * @param {number} filterType
	 * @param {Uint8Array} row
	 * @param {Uint8Array | undefined} prevDecodedRow
	 * @param {number} bpp
	 *
	 * @returns {Uint8Array}
	 */
	#decodeRow(filterType, row, prevDecodedRow, bpp) {
		switch (filterType) {
			case 0:
				return row;

			case 1:
				return this.#decodeSubFilter(row, bpp);

			case 2:
				return this.#decodeUpFilter(row, prevDecodedRow);

			case 3:
				return this.#decodeAverageFilter(row, prevDecodedRow, bpp);

			case 4:
				return this.#decodePaethFilter(row, prevDecodedRow, bpp);

			default:
				throw new Error("Invalid filter type.");
		}
	}

	/**
	 *
	 * @param {Uint8Array} decompressedIDAT
	 * @param {number} columnLength
	 * @param {number} bpp
	 *
	 * @returns {Uint8Array}
	 */
	#decodeFilter(decompressedIDAT, columnLength, bpp) {
		console.log(decompressedIDAT);
		// Since decompressedIDAT is 1D, we need an index
		// to base on to get the specific rows/scanline.
		let idx = 0;
		/**
		 * @type {Uint8Array | undefined}
		 */
		let latestDecodedRow;

		for (let y = 0; y < this.#pngHeader.height; ++y) {
			const filterType = decompressedIDAT[idx++];
			const row = decompressedIDAT.slice(idx, (idx += columnLength));
			const decodedRow = this.#decodeRow(
				filterType,
				row,
				latestDecodedRow,
				bpp
			);

			latestDecodedRow = decodedRow;
			decompressedIDAT.set(decodedRow, y * columnLength);
		}

		return decompressedIDAT;
	}

	#decompressIDATChunks() {
		return inflate(
			flattenChunks(this.#pngIDATChunks.map((idat) => idat.chunkData))
		);
	}

	#getBpp() {
		switch (this.#pngHeader.colorType) {
			case 0:
				return this.#pngHeader.bitDepth / 8;

			case 2:
				return 3 * (this.#pngHeader.bitDepth / 8);

			case 3:
				return 1;

			case 4:
				return 2 * (this.#pngHeader.bitDepth / 8);

			case 6:
				return 4 * (this.#pngHeader.bitDepth / 8);

			default:
				throw new Error("Invalid color type.");
		}
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
					this.#pngChunks[i + 1] &&
					this.#pngIDATChunks.length !== 0
				) {
					throw new Error("IDAT chunks must be consecutive.");
				}
			}
		}
	}
}

module.exports = PngDecoder;
