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
 * @fileoverview All main operations for computations
 * @module utils/numbers/compute/engine
 */

const { UnsupportedError } = require("../../debug/errors");
const { MAX_INT_32BIT, MIN_INT_32BIT } = require("../const");

/**
 * @typedef {number | bigint} JsNumber
 */

/**
 * @typedef {"int8" | "int16" | "int24" | "int32" | "int64" | "uint8" | "uint16" | "uint24" | "uint32" | "uint64"} NumberType
 */

/**
 * # isSignedByte
 *
 * Checks whether `num` is an 8-bit signed integer
 *
 * ## How it works
 *
 * Shift `num` to the left by 24; then, redo it to the right (signed right shift).
 * Then, checks if the resulting value is still equal to `num`.
 *
 * ### Why?
 *
 * Well, knowing how to do bitwise operations, albeit not great in JavaScript, is useful to get used to for
 * programming in low-level languages.
 *
 * First, we need to know the binary/bit representation of numbers in
 * memory. For example, `-128` and `-129`
 *
 * ```javascript
 * -128 // 0b11111111111111111111111110000000 or 32-bit signed, -0x80
 * -129 // 0b11111111111111111111111101111111 or 32-bit signed, -0x80000000
 * ```
 * Notice the difference?
 *
 * In signed integers, it's considered as an 8-bit integer,
 * if all bits from the least significant bit (LSB) up until the 7th bit (6th index)
 * are the only that are either `0` or `1`, while the remaining bits until the most significant
 * bit (MSB) is `1`.
 *
 * So, if we do `num << 24`, we will get:
 *
 * ```javascript
 * -128 // will be 0b10000000000000000000000000000000 or 32-bit signed, -2147483648
 * -129 // will be 0b01111111000000000000000000000000 or 32-bit signed, 2130706432
 * ```
 *
 * Notice the difference?
 *
 * The most significant bit's (MSB) information about `num`, which
 * is that it is `-129` or a signed integer, is lost.
 *
 * Now, after shifting `num` to the left, do `>> 24`, we will get:
 *
 * ```javascript
 * -128 // will be 0b11111111111111111111111110000000 or 32-bit signed, -128, -0x80
 * -129 // will be 0b00000000000000000000000001111111 or 32-bit signed, 127, 0x7f
 * ```
 *
 * The information that `num` is a signed integer is lost!
 *
 * @param {number} num
 * @returns {boolean}
 *
 * @see {@link https://www.w3schools.com/js/js_bitwise.asp} know how bit shifts work
 */
function isSignedByte(num) {
	if (isNaN(num) || !isFinite(num)) {
		return false;
	}
	return (num << 24) >> 24 === num;
}

/**
 * # isSignedShort(num)
 *
 * Checks whether `num` is a 16-bit signed integer
 *
 * ## How it works
 *
 * Shift `num` to the left by `16`; then, redo it to the right (signed bit shift).
 * Then, checks if the result is the same as `num`.
 *
 * ### Why?
 *
 * Check {@link isSignedByte} to know more about why this is performed.
 *
 * Instead of `24` from {@link isSignedByte}, `16` is used in this function.
 * Since the start of a 16-bit signed integer's binary/bit representation is:
 *
 * ```javascript
 * -32_768 // 0b11111111111111111000000000000000 or 32-bit signed, -0x8000
 * -32_769 // 0b11111111111111110111111111111111 or 32-bit signed, -0x8001
 * ```
 *
 * Now, do `num << 16`, we'll get:
 *
 * ```javascript
 * -32_768 // 0b10000000000000000000000000000000 or 32-bit signed, -2147483648, -0x80000000
 * -32_769 // 0b01111111111111110000000000000000 or 32-bit signed, 2147418112, 0x7fff0000
 * ```
 *
 * Now, do `num >> 16`, we'll get:
 *
 * ```javascript
 * -32_768 // 0b11111111111111111000000000000000 or 32-bit signed, -0x8000
 * -32_769 // 0b00000000000000000111111111111111 or 32-bit signed, 32767, 0x7fff
 * ```
 * The bit that indicates it's a signed integer is gone! That's why the information about
 * the original value is lost.
 *
 * @param {number} num
 * @returns {boolean}
 *
 * @see {@link https://www.w3schools.com/js/js_bitwise.asp}
 */
function isSignedShort(num) {
	if (isNaN(num) || !isFinite(num)) {
		return false;
	}
	return (num << 16) >> 16 === num;
}

/**
 * # isSigned24Bit
 *
 * Checks whether `num` is a 24-bit signed integer
 *
 * ## How it works
 *
 * Shift `num` to the left by `8` bits and back to the right by `8` bits. Now, since integers in JavaScript are
 * 32-bit ints, the original value of `num` would then be lost. So, to know if `num` is a 24-bit signed integer,
 * we compare the result to `num`.
 *
 * | Value                | Binary                             |
 * | -------------------- | ---------------------------------- |
 * | 8388607              | 0b00000000011111111111111111111111 |
 *
 * See how it will work? Now, let's check the bit representation of {@link MAX_INT_24BIT},
 *
 * | Value                | Binary                             |
 * | -------------------- | ---------------------------------- |
 * | 8388608              | 0b00000000100000000000000000000000 |
 *
 * @param {number} num
 * @returns {boolean}
 *
 * @see {@link https://www.w3schools.com/js/js_bitwise.asp}
 * @see {@link isSignedByte}
 */
function isSigned24Bit(num) {
	if (isNaN(num) || !isFinite(num)) {
		return false;
	}
	return (num << 8) >> 8 === num;
}

/**
 * #isSignedInt
 *
 * Checks whether `num` is a 32-bit signed integer
 *
 * ## How it works
 *
 * Since `num | 0` will try to convert it to a 32-bit signed integer, we'll
 * just compare the result to `num`.
 *
 * ### Why?
 *
 * JavaScript integers are 32-bits in memory.
 *
 * @param {number} num
 * @returns {boolean}
 */
function isSignedInt(num) {
	if (isNaN(num) || !isFinite(num)) {
		return false;
	}

	return num === (num | 0);
}

/**
 * @param {number} num
 * @returns {boolean}
 *
 * @see {@link https://www.w3schools.com/js/js_bitwise.asp}
 */
function isUnsignedByte(num) {
	if (isNaN(num) || !isFinite(num)) {
		return false;
	}

	return (num & 0xff) === num;
}

/**
 *
 * @param {number} num
 * @returns {boolean}
 */
function isUnsignedShort(num) {
	if (isNaN(num) || !isFinite(num)) {
		return false;
	}
	return (num & 0xffff) === num;
}

/**
 *
 * @param {number} num
 * @returns {boolean}
 */
function isUnsigned24Bit(num) {
	if (isNaN(num) || !isFinite(num)) {
		return false;
	}

	return (num & 0xffffff) === num;
}

/**
 * Despite knowing that, in memory, all numbers in JavaScript are double precision floating-points,
 * and all integers are 32-bit, this still is useful to check the range `num` is in.
 *
 * @param {JsNumber} num
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

module.exports = {
	isSignedByte,
	isSignedShort,
	isSigned24Bit,
	isSignedInt,
	isUnsignedByte,
	isUnsignedShort,
	isUnsigned24Bit,
	getNumberType,
};
