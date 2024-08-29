/**
 * @license
 *
 * This code is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * See the LICENSE file for details.
 * Full license text: https://creativecommons.org/licenses/by/4.0/
 * Copyright (c) 2024 Aaron Ragudos
 */

/**
 * @fileoverview contains all assertion methods used by the program.
 * @module utils/debug/assert
 */

/**
 * @param {boolean} condition What to assert. Logs an error if false
 * @param {string | Error} [message] Error message
 *
 * @returns {void}
 */
function assert(condition, message) {
	if (condition) {
		return;
	}

	debugger;

	if (!message) {
		console.error(new Error("Assertion failed"));

		return;
	}

	if (message instanceof Error) {
		console.error(message);

		return;
	}

	console.error(new Error(message));
}

module.exports = { assert };
