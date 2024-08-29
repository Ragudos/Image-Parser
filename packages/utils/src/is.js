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
 * @return {boolean}
 */
exports.isPlainObject = function (obj) {
	return (
		typeof obj === "object" &&
		!(obj instanceof Array) &&
		obj instanceof Object
	);
};

/**
 * @param {unknown} obj
 * @return {boolean}
 */
exports.isFunction = function (obj) {
	return typeof obj === "function";
};

/**
 * @param {unknown} obj
 * @return {boolean}
 */
exports.isString = function (obj) {
	return typeof obj === "string";
};

/**
 * @param {unknown} obj
 * @return {boolean}
 */
exports.isArray = function (obj) {
	return obj instanceof Array;
};

/**
 * @param {unknown} obj
 * @return {boolean}
 */
exports.isNumber = function (obj) {
	return typeof obj === "number" && !isNaN(obj);
};
