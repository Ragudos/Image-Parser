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
 * @typedef {"int8" | "int16" | "int32" | "int64" | "uint8" | "uint16" | "uint32" | "uint64"} NumberType
 */

/**
 * # isSignedByte(num)
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
	return (num << 16) >> 16 === num;
}

/**
 * #isSignedInt(num)
 *
 * Checks whether `num` is a 32-bit signed integer
 *
 * ## How it works
 *
 * Unlike {@link isSignedByte} and {@link isSignedShort}, we just compare
 * `num` with {@link MIN_INT_32BIT} and {@link MAX_INT_32BIT}.
 *
 * ### Why?
 *
 * JavaScript integers are 32-bits in memory.
 *
 * @param {number} num
 * @returns {boolean}
 */
function isSignedInt(num) {
	return num >= MIN_INT_32BIT && num <= MAX_INT_32BIT;
}

/**
 * # isUnsignedByte(num)
 *
 * Checks whether `num` is an 8-bit unsigned integer.
 *
 * ## How it works
 *
 * Applies the AND (&) bitwise operator to `num` and `0xffff00`; then,
 * compares the result to `0`.
 *
 * The AND (&) bitwise operator is somewhat the same
 * as the AND (&&) logical operator; wherein, it will return true if both
 * operands are true and have it be 1, while 0 otherwise.
 *
 * The right-hand side can be considered as a `mask`.
 *
 * ### Why?
 *
 * First, we must know the value of `0xffff00` in binary/bits.
 *
 * ```javascript
 * 0xffff00 // 0b00000000111111111111111100000000
 * 255 // 0b00000000000000000000000011111111
 * 256 // 0b00000000000000000000000100000000
 * ```
 * See the differences? Now, let's perform the AND (&) bitwise operation
 *
 * `255 & 0xffff00`
 *
 * | Operation             | Value    | Binary                             |
 * | --------------------- | -----    | ---------------------------------- |
 * | Original Value        | 255      | 0b00000000000000000000000011111111 |
 * | Mask                  | 0xffff00 | 0b00000000111111111111111100000000 |
 * | Original Value & Mask | 0        | 0b00000000000000000000000000000000 |
 *
 * @param {number} num
 * @returns {boolean}
 *
 * @see {@link https://www.w3schools.com/js/js_bitwise.asp}
 */
function isUnsignedByte(num) {
	return (num & 0xffff00) === 0;
}

/**
 * # isUnsignedShort
 *
 * Checks whether `num` is a 16-bit unsigned integer
 *
 * ## How it works
 *
 * The same as {@link isUnsignedByte}, but instead uses `0xff0000` as the `mask`.
 *
 * @param {number} num
 * @returns {boolean}
 */
function isUnsignedShort(num) {
	return (num & 0xff0000) === 0;
}

/**
 * Despite knowing that, in memory, all numbers in JavaScript are double precision floating-points,
 * and all integers are 32-bit, this still is useful to check the range `num` is in.
 *
 * @param {JsNumber} num
 * @returns {NumberType} returns the type of integer `num` is.
 *
 * @throws {Error} Gets an unsupported number type
 */
function getNumberType(num) {
	if (typeof num === "bigint") {
		throw new UnsupportedError();
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
	isSignedInt,
	isUnsignedByte,
	isUnsignedShort,
	getNumberType,
};
