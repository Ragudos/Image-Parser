/**
 * @license
 *
 * This code is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * See the LICENSE file for details.
 * Full license text: https://creativecommons.org/licenses/by/4.0/
 * Copyright (c) 2024 Aaron Ragudos
 */

const { UnsupportedError } = require("../../debug/errors");
const { MAX_UINT_32BIT } = require("../const");
const {
	isUnsignedByte,
	getNumberType,
	isSignedInt,
	isSignedByte,
	isSignedShort,
	isUnsignedShort,
} = require("./engine");

/**
 * **Note**:
 * - Floating points are not supported
 *
 * Bytes to number operations will shift
 * the most significant byte (MSB) in Big-Endian format, while
 * the least significant byte in Little-Endian format, to the left,
 * from the desired bit width, going down by 8 for each following
 * byte until all bytes have been combined using the OR (|) bitwise operator.
 *
 * Bytes to int and vice versa does things, well, vice versa. If we convert
 * bytes to int by shifting the bytes to the left based on their significance, then
 * we shift a number to the right to get the byte equivalent of each 8-bit section
 * of the number.
 *
 * To convert bytes to a signed integer, then we must check whether it can indeed
 * be a signed integer by checking its respective bit width.
 *
 * To do this, the resulting unsigned integer will be masked by the
 * maximum of the values of respective signed integers' bits `plus 1`.
 *
 * For example, if we convert two bytes
 * to an integer, a 16-bit uint will be acquired.
 *
 * Then, if a 16-bit int is desired, we mask it by `0x8000` or `32_768`
 * to check if the value is negative in signed format. If it is,
 * then subtract it by the maximum value of 16-bit uint `plus 1`, which is `0x10000`
 * or `65536`. The result will be the 16-bit int value of the two bytes.
 *
 * How does this work? Well, try masking `-127` to `0xff` or `255`, and you'll
 * get `129`. Do this continuously until `-1`, and you'll soon reach `255`.
 *
 * In essence, the reason why signed integers have lower positive values than their equivalent
 * unsigned integers is to account for the negative values.
 *
 * Thus, if a value is greater than the max of its signed format's positive value, then it's
 * a negative value in its signed format.
 *
 * @fileoverview All main operations for conversions
 * @module utils/numbers/compute/conversion
 */

/**
 *
 * @param {number} highByte
 * @param {number} lowByte
 * @param {boolean} [littleEndian]
 *
 * @returns {number}
 *
 * @throws {RangeError} if `highByte` nor `lowByte` is not a byte
 */
function bytesTo16BitUint(highByte, lowByte, littleEndian) {
	if (!isUnsignedByte(highByte) || !isUnsignedByte(lowByte)) {
		throw new RangeError();
	}

	if (littleEndian) {
		return (lowByte << 8) | highByte;
	}

	return (highByte << 8) | lowByte;
}

/**
 *
 * @param {number} highestByte
 * @param {number} midByte
 * @param {number} lowestByte
 * @param {boolean} [littleEndian]
 *
 * @returns {number}
 *
 * @throws {RangeError} if `highestByte`, `midByte`, nor `lowestByte` is not a byte
 */
function bytesTo24BitUint(highestByte, midByte, lowestByte, littleEndian) {
	if (
		!isUnsignedByte(highestByte) ||
		!isUnsignedByte(midByte) ||
		!isUnsignedByte(lowestByte)
	) {
		throw new RangeError();
	}

	if (littleEndian) {
		return (lowestByte << 16) | (midByte << 8) | highestByte;
	}

	return (highestByte << 16) | (midByte << 8) | lowestByte;
}

/**
 *
 * @param {number} highestByte
 * @param {number} firstMidByte
 * @param {number} secondMidByte
 * @param {number} lowestByte
 * @param {number} littleEndian
 *
 * @returns {number}
 *
 * @throws {RangeError} if `highestByte`, `firstMidByte`, `secondMidByte` nor `lowestByte` is not a byte

 */
function bytesTo32BitUint(
	highestByte,
	firstMidByte,
	secondMidByte,
	lowestByte,
	littleEndian
) {
	if (
		!isUnsignedByte(highestByte) ||
		!isUnsignedByte(firstMidByte) ||
		!isUnsignedByte(secondMidByte) ||
		!isUnsignedByte(lowestByte)
	) {
		throw new RangeError();
	}

	if (littleEndian) {
		return (
			(lowestByte << 24) |
			(secondMidByte << 16) |
			(firstMidByte << 8) |
			highestByte
		);
	}

	return (
		(highestByte << 24) |
		(firstMidByte << 16) |
		(secondMidByte << 8) |
		lowestByte
	);
}

/**
 *
 * @param {number} num
 *
 * @returns {[number]}
 *
 * @throws {RangeError} if `num` is not uint8
 */
function uint8ToBytes(num) {
	if (!isUnsignedByte(num)) {
		throw new RangeError();
	}

	return [num];
}

/**
 *
 * @param {number} num
 *
 * @returns {[number]}
 *
 * @throws {RangeError} if `num` is not int8
 */
function int8ToBytes(num) {
	if (!isSignedByte(num)) {
		throw new RangeError();
	}

	return [num & 0xff];
}

/**
 *
 * @param {number} num
 * @param {boolean} [littleEndian]
 *
 * @returns {[number, number]}
 *
 * @throws {RangeError} if `num` is not int16
 */
function int16ToBytes(num, littleEndian) {
	if (!isSignedShort(num)) {
		throw new RangeError();
	}

	const highestByte = (num >> 8) & 0xff;
	const lowestByte = num & 0xff;

	if (littleEndian) {
		return [lowestByte, highestByte];
	}

	return [highestByte, lowestByte];
}

/**
 * Does not mask the result of `num >> 8` to `0xff`
 *
 * @param {number} num
 * @param {boolean} [littleEndian]
 *
 * @returns {[number, number]}
 *
 * @throws {RangeError} if `num` is not uint16
 */
function uint16ToBytes(num, littleEndian) {
	if (!isUnsignedShort(num)) {
		throw new RangeError();
	}

	const highestByte = num >> 8;
	const lowestByte = num & 0xff;

	if (littleEndian) {
		return [lowestByte, highestByte];
	}

	return [highestByte, lowestByte];
}

/**
 *
 * @param {number} num
 * @param {boolean} [littleEndian]
 *
 * @returns {[number, number, number]}
 *
 * @throws {RangeError} if `num` is not int24
 */
function int24ToBytes(num, littleEndian) {}

/**
 *
 * @param {number} num
 * @param {boolean} [littleEndian]
 *
 * @returns {[number, number, number]}
 *
 * @throws {RangeError} if `num` is not int24
 */
function uint24ToBytes(num, littleEndian) {}

/**
 *
 * @param {number} num
 * @param {boolean} [littleEndian]
 *
 * @returns {[number, number, number, number]}
 *
 * @throws {RangeError} if `num` is not int24
 */
function int32ToBytes(num, littleEndian) {}

/**
 *
 * @param {number} num
 * @param {boolean} [littleEndian]
 *
 * @returns {[number, number, number, number]}
 *
 * @throws {RangeError} if `num` is not int24
 */
function uint32ToBytes(num, littleEndian) {}

/**
 *
 * @param {import("./engine").JsNumber} num
 * @param {boolean} [littleEndian]
 *
 * @returns {Array<number>}
 *
 * @throws {UnsupportedError | RangeError} if `num` exceeds the maximum value a 32-bit unsigned integer can hold, or an operation is unsupported.
 */
function numToBytes(num, littleEndian) {
	if (typeof num === "bigint") {
		throw new UnsupportedError();
	}

	if (num > MAX_UINT_32BIT) {
		throw new RangeError();
	}

	switch (getNumberType(num)) {
		case "int8":
			return int8ToBytes(num);
		case "uint8":
			return uint8ToBytes(num);
		case "int16":
			return int16ToBytes(num, littleEndian);
		case "uint16":
			return uint16ToBytes(num, littleEndian);
		case "int32":
			return int32ToBytes(num, littleEndian);
		case "uint32":
			return uint32ToBytes(num, littleEndian);
		default:
			throw new UnsupportedError();
	}
}

module.exports = {
	bytesTo16BitUint,
	bytesTo24BitUint,
	bytesTo32BitUint,
	int8ToBytes,
	int16ToBytes,
	uint8ToBytes,
	uint16ToBytes,
};
