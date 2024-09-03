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
} = require("@image-parser/utils");
const { PNG_SIGNATURE, CHARACTER_ASCII_CODES } = require("./const");
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
 * @param {Uint8Array} _rawData
 */
function processPNG(_rawData) {
	throw new UnimplementedError();

	/*isValidPNG(rawData);

	const chunks = getPNGChunks(rawData);
	const header = getIHDR(chunks);*/
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
	const bitDepth = IHDRChunk.data[8];
	const colorType = IHDRChunk.data[9];
	const compressionMethod = IHDRChunk.data[10];
	const filterMethod = IHDRChunk.data[11];
	const interlaceMethod = IHDRChunk.data[12];

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

		// TODO: calculate the CRC here to check for data corruption of the chunk.
		const calculatedCRC = CRC.calculateCRC(
			rawData.slice(offset, offset + 4 + chunkLength)
		);

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

module.exports = { processPNG, getIHDR, getPNGChunks, isValidPNG };
