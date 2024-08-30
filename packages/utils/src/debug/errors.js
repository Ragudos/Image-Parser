/**
 * @license
 *
 * This code is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * See the LICENSE file for details.
 * Full license text: https://creativecommons.org/licenses/by/4.0/
 * Copyright (c) 2024 Aaron Ragudos
 */

/**
 * @fileoverview A file of all custom errors
 *
 * @module utils/debug/errors
 */

/** */
class UnsupportedError extends Error {
	/**
	 * @param {string} [message]
	 */
	constructor(message) {
		super(`Currently unsupported. ${message}`);

		this.name = "UnsupportedError";
	}
}

class UnimplementedError extends Error {
	/**
	 *
	 * @param {string} [message]
	 */
	constructor(message) {
		super(`Currently unimplemented. ${message}`);

		this.name = "UnimplementedError";
	}
}

module.exports = { UnsupportedError, UnimplementedError };
