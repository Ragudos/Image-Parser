/**
 * @license
 *
 * This code is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * See the LICENSE file for details.
 * Full license text: https://creativecommons.org/licenses/by/4.0/
 * Copyright (c) 2024 Aaron Ragudos
 */

/**
 * **Note**:
 * - Floating points are not supported
 *
 * Functions in this file will use these bitwise operators:
 * - `<<` left shift
 * - `>>` right shift (signed, will use the leftmost bit when shifting, preserving the integer's sign).
 * - `|` OR operator
 * - `&` AND operator
 *
 * Even though all numbers in JavaScript are 64-bit double precision
 * floating points and converts operands of bitwise operations to int32.
 * for bitwise operations to work properly, it would still be nice to
 * check for a number's range (8-bit, 16-bit, etc.).
 *
 * It's still logical to use a custom `Integer` class and using strings, but for the
 * sake of learning, I'm using bitwise operations if possible.
 *
 * To give an example for the operations of the functions in this file:
 *
 * {@link isSignedByte} will check whether a number is int8.
 *
 * Since all integers in JavaScript is 32-bit, this function will shift the number to the
 * left `24` bits and back to the right by `24` bits.
 *
 * If the number is originally an 8-bit number, then the final result will still be
 * itself; otherwise, its significant bits (bits information after the least 8 bits) is lost.
 *
 * Lastly, uint32 cannot be fully supported by JavaScript
 *
 * See the table below to compare the binary representation of specific numbers to understand
 * how we can check their type using the mentioned operations:
 *
 * | Value                          | Binary                             |
 * | -----------------------------  | ---------------------------------- |
 * | (Maximum int24) 8388607        | 0b00000000011111111111111111111111 |
 * | 8388608                        | 0b00000000100000000000000000000000 |
 * | (Maximum uint8) 255            | 0b00000000000000000000000011111111 |
 * | 256                            | 0b00000000000000000000000100000000 |
 * | (Maximum int32) 2_147_483_647  | 0b01111111111111111111111111111111 |
 * | (Maximum uint32) 4_294_967_295 | 0b1111111111111111111111111111111  |
 * | 2_147_483_648                  | 0b10000000000000000000000000000000 |
 *
 * The maximum uint32 should have more than 32 bits so it does not get represented as int32,
 * but that is not possible in JavaScript (weird, I know). Thus, this value will be interpreted
 * as int32 if operated with `num | 0`, having the value of `num | 0` not be equal to `num`.
 *
 * @fileoverview All main operations for computations
 * @module utils/numbers/compute/engine
 *
 * @see {@link https://bitwisecmd.com/}
 * @see {@link https://www.w3schools.com/js/js_bitwise.asp} know how bit shifts work
 * @see {@link https://byjus.com/maths/binary-number-system/} to know about the binary number system
 */

const { UnsupportedError } = require("../../debug/errors");

/**
 * @typedef {number | bigint} JsNumber
 */

/**
 * @typedef {"int8" | "int16" | "int24" | "int32" | "int64" | "uint8" | "uint16" | "uint24" | "uint32" | "uint64"} NumberType
 */

/**
 *
 * @param {number} num
 * @param {boolean} [skipCheck]
 *
 * @returns {boolean}
 */
function isSignedByte(num, skipCheck) {
	if (!skipCheck) {
		if (isNaN(num) || !isFinite(num)) {
			return false;
		}
	}

	return (num << 24) >> 24 === num;
}

/**
 *
 * @param {number} num
 * @param {boolean} [skipCheck]
 *
 * @returns {boolean}
 */
function isSignedShort(num, skipCheck) {
	if (!skipCheck) {
		if (isNaN(num) || !isFinite(num)) {
			return false;
		}
	}

	return (num << 16) >> 16 === num;
}

/**
 *
 * @param {number} num
 * @param {boolean} [skipCheck]
 *
 * @returns {boolean}
 */
function isSigned24Bit(num, skipCheck) {
	if (!skipCheck) {
		if (isNaN(num) || !isFinite(num)) {
			return false;
		}
	}

	return (num << 8) >> 8 === num;
}

/**
 *
 * @param {number} num
 * @param {boolean} [skipCheck]
 *
 * @returns {boolean}
 */
function isSignedInt(num, skipCheck) {
	if (!skipCheck) {
		if (isNaN(num) || !isFinite(num)) {
			return false;
		}
	}

	return num === (num | 0);
}

/**
 *
 * @param {number} num
 * @param {boolean} [skipCheck]
 *
 * @returns {boolean}
 */
function isUnsignedByte(num, skipCheck) {
	if (!skipCheck) {
		if (isNaN(num) || !isFinite(num)) {
			return false;
		}
	}

	return (num & 0xff) === num;
}

/**
 *
 * @param {number} num
 * @param {boolean} [skipCheck]
 *
 * @returns {boolean}
 */
function isUnsignedShort(num, skipCheck) {
	if (!skipCheck) {
		if (isNaN(num) || !isFinite(num)) {
			return false;
		}
	}

	return (num & 0xffff) === num;
}

/**
 *
 * @param {number} num
 * @param {boolean} [skipCheck]
 *
 * @returns {boolean}
 */
function isUnsigned24Bit(num, skipCheck) {
	if (!skipCheck) {
		if (isNaN(num) || !isFinite(num)) {
			return false;
		}
	}

	return (num & 0xffffff) === num;
}

/**
 *
 * @param {JsNumber} num
 *
 * @returns {NumberType} returns the type of integer `num` is.
 *
 * @throws {UnsupportedError | TypeError} gets an unsupported number type or invalid argument
 */
function getNumberType(num) {
	if (typeof num === "bigint") {
		throw new UnsupportedError();
	}

	if (isNaN(num) || !isFinite(num)) {
		throw new TypeError();
	}

	if (isSignedByte(num)) {
		return "int8";
	}

	if (isUnsignedByte(num)) {
		return "uint8";
	}

	if (isSignedShort(num)) {
		return "int16";
	}

	if (isUnsignedShort(num)) {
		return "uint16";
	}

	if (isSigned24Bit(num)) {
		return "int24";
	}

	if (isUnsigned24Bit(num)) {
		return "uint24";
	}

	if (isSignedInt(num)) {
		return "int32";
	}

	if (!(num < 0)) {
		return "uint32";
	}

	throw new UnsupportedError();
}

/**
 *
 * @param {number} num
 * @param {number} bitPosition
 *
 * @returns {number}
 *
 * @throws {TypeError | RangeError} if `num` or `bitPosition` are `NaN` or `Infinity` or `bitPosition` > 32
 */
function getBitAt(num, bitPosition) {
	if (isNaN(num) || !isFinite(num)) {
		throw new TypeError();
	}

	if (isNaN(bitPosition) || !isFinite(bitPosition)) {
		throw new TypeError();
	}

	if (bitPosition > 32) {
		throw new RangeError();
	}

	return (num >> bitPosition) & 1;
}

module.exports = {
	isSignedByte,
	isSignedShort,
	isSigned24Bit,
	isSignedInt,
	isUnsignedByte,
	isUnsignedShort,
	isUnsigned24Bit,
	getNumberType,
	getBitAt,
};
