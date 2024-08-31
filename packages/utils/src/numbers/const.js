/**
 * @license
 *
 * This code is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * See the LICENSE file for details.
 * Full license text: https://creativecommons.org/licenses/by/4.0/
 * Copyright (c) 2024 Aaron Ragudos
 */

/**
 * @fileoverview contains constants about number that are used by the program
 * @module utils/numbers/const
 */

const MAX_UINT_8BIT = 0xff;
const MAX_UINT_16BIT = 0xffff;
const MAX_UINT_24BIT = 0xffffff;
const MAX_UINT_32BIT = 0xffffffff;
const MAX_UINT_64BIT = BigInt("18446744073709551615");
const MIN_INT_8BIT = -0x80;
const MIN_INT_16BIT = -0x8000;
const MIN_INT_24BIT = -0x800000;
const MIN_INT_32BIT = -0x80000000;
const MIN_INT_64BIT = BigInt("-9223372036854775808");
const MAX_INT_8BIT = 0x7f;
const MAX_INT_16BIT = 0x7fff;
const MAX_INT_24BIT = 0x7fffff;
const MAX_INT_32BIT = 0x7fffffff;
const MAX_INT_64BIT = BigInt("9223372036854775807");

module.exports = {
	MAX_INT_16BIT,
	MAX_INT_24BIT,
	MAX_INT_32BIT,
	MAX_INT_64BIT,
	MAX_INT_8BIT,
	MAX_UINT_16BIT,
	MAX_UINT_24BIT,
	MAX_UINT_32BIT,
	MAX_UINT_64BIT,
	MAX_UINT_8BIT,
	MIN_INT_16BIT,
	MIN_INT_24BIT,
	MIN_INT_32BIT,
	MIN_INT_64BIT,
	MIN_INT_8BIT,
};
