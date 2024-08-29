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

const MAX_UINT_8BIT = 255;
const MAX_UINT_16BIT = 65_535;
const MAX_UINT_32BIT = 4_294_967_295;
const MAX_UINT_64BIT = BigInt("18446744073709551615");
const MIN_INT_8BIT = -128;
const MIN_INT_16BIT = -32_768;
const MIN_INT_32BIT = -2_147_483_648;
const MIN_INT_64BIT = BigInt("-9223372036854775808");
const MAX_INT_8BIT = 127;
const MAX_INT_16BIT = 32_767;
const MAX_INT_32BIT = 2_147_483_647;
const MAX_INT_64BIT = BigInt("9223372036854775807");

module.exports = {
	MAX_INT_16BIT,
	MAX_INT_32BIT,
	MAX_INT_64BIT,
	MAX_INT_8BIT,
	MAX_UINT_16BIT,
	MAX_UINT_32BIT,
	MAX_UINT_64BIT,
	MAX_UINT_8BIT,
	MIN_INT_16BIT,
	MIN_INT_32BIT,
	MIN_INT_64BIT,
	MIN_INT_8BIT,
};
