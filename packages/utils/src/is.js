/**
 * @license
 *
 * This code is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * See the LICENSE file for details.
 * Full license text: https://creativecommons.org/licenses/by/4.0/
 * Copyright (c) 2024 Aaron Ragudos
 */

/**
 * @fileoverview A list of utilities that determine what an unknown variable is.
 * @module utils/is
 */

/**
 * @param {unknown} obj
 * @returns {boolean}
 */
function isPlainObject(obj) {
	return (
		typeof obj === "object" &&
		!(obj instanceof Array) &&
		obj instanceof Object
	);
}

/**
 * @param {unknown} obj
 * @returns {boolean}
 */
function isFunction(obj) {
	return typeof obj === "function";
}

/**
 * @param {unknown} obj
 * @returns {boolean}
 */
function isString(obj) {
	return typeof obj === "string";
}

/**
 * @param {unknown} obj
 * @returns {boolean}
 */
function isArray(obj) {
	return obj instanceof Array;
}

/**
 * @param {unknown} obj
 * @returns {boolean}
 */
function isNumber(obj) {
	return typeof obj === "number" && !isNaN(obj);
}

module.exports = {
	isPlainObject,
	isArray,
	isFunction,
	isNumber,
	isString,
};
