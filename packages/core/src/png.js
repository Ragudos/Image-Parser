/**
 * @license
 *
 * This code is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * See the LICENSE file for details.
 * Full license text: https://creativecommons.org/licenses/by/4.0/
 * Copyright (c) 2024 Aaron Ragudos
 */

const {
	getBitAt,
	bytesTo32BitUint,
	assert,
	UnimplementedError,
	isNumber,
} = require("@image-parser/utils");
const {
	PNG_SIGNATURE,
	CHARACTER_ASCII_CODES,
	PNG_COLOR_TYPES,
} = require("./const");
const { CRC } = require("./crc");

/**
 * @fileoverview ALl PNG related operations are in this file.
 * @module core/png
 */

/**
 * @typedef {"IDAT" | "IHDR" | "PLTE" | "IEND"} PngCriticalTypeCodes all PNG special-purpose public chunk types.
 */

/**
 * @typedef {Object} PngChunk
 * @property {number} chunkLength
 * @property {string} typeCode
 * @property {Uint8Array} data
 * @property {number} crc
 * @property {number} calculatedCRC
 * @property {boolean} isCorrupted if `crc` !== `calculatedCRC`
 * @property {boolean} isSafe whether this chunk has an ancillary bit of `1` and is unknown.
 */

/**
 * @typedef {Object} PngMetadata
 * @property {number} width 4 bytes
 * @property {number} height 4 bytes
 * @property {number} bitDepth 1 byte
 * @property {number} colorType 1 byte
 * @property {number} compressionMethod 1 byte
 * @property {number} filterMethod 1 byte
 * @property {number} interlaceMethod 1 byte
 */

/**
 *
 * @param {Uint8Array} rawData
 */
function processPNG(rawData) {
	isValidPNG(rawData);

	const chunks = getPNGChunks(rawData);

	if (chunks.at(-1)?.typeCode !== "IEND") {
		throw new Error(
			"PNG chunks/data should have an IEND chunk as its last chunk."
		);
	}

	const header = getIHDR(chunks);

	/**
	 *
	 * @type {Uint8Array | undefined}
	 */
	let plte;

	// Since only a color type of 3 is when a PLTE is required and for 2 and 6 has optional PLTEs
	if (header.colorType === 3) {
		plte = getPLTE(chunks, header);
	} else if (header.colorType === 2 || header.colorType === 6) {
		//
	}

	const rawIDAT = getRawIDAT(chunks);

	// TODO: Get possible ancillary chunks in the future

}

/**
 *
 * @param {PngChunk[]} chunks
 *
 * @returns {PngChunk[]}
 *
 * @throws {Error} if IDAT chunks' stream is interrupted by a different chunk.
 */
function getRawIDAT(chunks) {
	/**
	 *
	 * @type {PngChunk[]}
	 */
	const rawIDAT = [];

	// start at 1 since IHDR should be the first chunk
	for (let i = 1; i < chunks.length; ++i) {
		if (chunks[i].typeCode === "IDAT") {
			rawIDAT.push(chunks[i]);
		} else if (chunks[i].typeCode !== "IEND") {
			if (chunks.at(i + 1)?.typeCode === "IDAT" && rawIDAT.length !== 0) {
				throw new Error(
					"IDAT chunk stream is interrupted and not continuous at chunk index " +
					i
				);
			}
		}
	}

	return rawIDAT;
}

/**
 *
 * @param {PngChunk[]} chunks
 * @param {PngMetadata} header
 *
 * @returns {Uint8Array | undefined}
 *
 * @throws {RangeError} when PLTE palette entries is more than `colorType^bitDepth`
 */
function getPLTE(chunks, header) {
	// start at 1 since IHDR should be the first chunk
	for (let i = 1; i < chunks.length; ++i) {
		if (chunks[i].typeCode === "PLTE") {
			if (
				chunks[i].data.length >
				Math.pow(header.colorType, header.bitDepth)
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
					header.colorType +
					" and bit depth of " +
					header.bitDepth
				);
			}

			return chunks[i].data;
		}
	}
}

/**
 *
 * @param {PngChunk[]} chunks
 *
 * @returns {PngMetadata}
 */
function getIHDR(chunks) {
	assert(
		chunks[0].typeCode === "IHDR",
		"The first chunk is not of type `IHDR`"
	);

	const IHDRChunk = chunks[0];
	const width = bytesTo32BitUint(
		IHDRChunk.data[0],
		IHDRChunk.data[1],
		IHDRChunk.data[2],
		IHDRChunk.data[3]
	);
	const height = bytesTo32BitUint(
		IHDRChunk.data[4],
		IHDRChunk.data[5],
		IHDRChunk.data[6],
		IHDRChunk.data[7]
	);

	assert(width !== 0 || height !== 0, "Dimensions must be > 0.");

	const bitDepth = IHDRChunk.data[8];
	const colorType = IHDRChunk.data[9];

	assert(isValidBitDepthAndColorType(colorType, bitDepth));

	const compressionMethod = IHDRChunk.data[10];

	assert(
		compressionMethod === 0,
		"Compression method, for now, is only 0 (DEFLATE)"
	);

	const filterMethod = IHDRChunk.data[11];

	assert(
		filterMethod === 0,
		"Filter method,for now, must only be 0 (Adaptive filtering)"
	);

	const interlaceMethod = IHDRChunk.data[12];

	assert(interlaceMethod === 0 || interlaceMethod === 1, "");

	return {
		width,
		height,
		bitDepth,
		colorType,
		filterMethod,
		compressionMethod,
		interlaceMethod,
	};
}

/**
 *
 * @param {Uint8Array} rawData
 *
 * @returns {Array<PngChunk>}
 */
function getPNGChunks(rawData) {
	let offset = 8;

	/**
	 * @type {Array<PngChunk>}
	 */
	const chunks = [];

	while (offset < rawData.length) {
		const chunkLength = bytesTo32BitUint(
			rawData[offset++],
			rawData[offset++],
			rawData[offset++],
			rawData[offset++]
		);

		const calculatedCRC = CRC.calculateCRC(
			rawData.slice(offset, offset + 4 + chunkLength)
		);

		// TODO: Have a option where ancillary chunks are skipped to make this
		// useful

		const ancillaryBit = rawData[offset++];
		const privacyBit = rawData[offset++];
		const reservedBit = rawData[offset++];
		const safeToCopyBit = rawData[offset++];
		const isCriticalChunk = getBitAt(ancillaryBit, 5) === 0;
		const typeCode = String.fromCharCode(
			ancillaryBit,
			privacyBit,
			reservedBit,
			safeToCopyBit
		);
		const data = rawData.slice(offset, (offset += chunkLength));
		const crc = bytesTo32BitUint(
			rawData[offset++],
			rawData[offset++],
			rawData[offset++],
			rawData[offset++]
		);

		chunks.push({
			chunkLength,
			typeCode,
			data,
			crc,
			calculatedCRC,
			isCorrupted: crc !== calculatedCRC,
			isSafe:
				isCriticalChunk &&
				ancillaryBit !== CHARACTER_ASCII_CODES.I &&
				ancillaryBit !== CHARACTER_ASCII_CODES.P,
		});
	}

	return chunks;
}

/**
 *
 * @param {Uint8Array} rawData
 */
function isValidPNG(rawData) {
	for (let i = 0; i < PNG_SIGNATURE.length; ++i) {
		if (rawData[i] !== PNG_SIGNATURE[i]) {
			throw new TypeError();
		}
	}
}

/**
 * @param {Uint8Array} plteChunkData
 * @returns {boolean}
 */
function isValidPLTE(plteChunkData) {
	return plteChunkData.length % 3 === 0;
}

/**
 *
 * Since there are bitDepth and colorType restrictions, we need to check here
 *
 * @param {number} colorType
 * @param {number} bitDepth
 *
 * @returns {boolean}
 *
 * @throws {TypeError} if either `bitDepth` or `colorType` is invalid.
 */
function isValidBitDepthAndColorType(colorType, bitDepth) {
	if (!isNumber(colorType) || !isNumber(bitDepth)) {
		throw new TypeError(
			"`colorType` or `bitDepth` must be a valid number."
		);
	}

	if (
		colorType !== PNG_COLOR_TYPES.grayscale &&
		colorType !== PNG_COLOR_TYPES.rgb &&
		colorType !== PNG_COLOR_TYPES.plte &&
		colorType !== PNG_COLOR_TYPES.grayscaleAlpha &&
		colorType !== PNG_COLOR_TYPES.rgbAlpha
	) {
		throw new TypeError();
	}

	if (bitDepth > 16 || bitDepth < 1) {
		throw new TypeError();
	}

	if (bitDepth !== 1 && bitDepth !== 2) {
		if (bitDepth % 4 !== 0) {
			throw new TypeError();
		}
	}

	switch (colorType) {
		case PNG_COLOR_TYPES.grayscale:
			return (
				bitDepth === 1 ||
				bitDepth === 2 ||
				bitDepth === 4 ||
				bitDepth === 8 ||
				bitDepth === 16
			);

		case PNG_COLOR_TYPES.rgb:
			return bitDepth === 8 || bitDepth === 16;

		case PNG_COLOR_TYPES.plte:
			return (
				bitDepth === 1 ||
				bitDepth === 2 ||
				bitDepth === 4 ||
				bitDepth === 8
			);

		case PNG_COLOR_TYPES.grayscaleAlpha:
			return bitDepth === 8 || bitDepth === 16;

		case PNG_COLOR_TYPES.rgbAlpha:
			return bitDepth === 8 || bitDepth === 16;
	}
}

module.exports = {
	processPNG,
	getIHDR,
	getPNGChunks,
	isValidPNG,
	isValidPLTE,
	isValidBitDepthAndColorType,
};
