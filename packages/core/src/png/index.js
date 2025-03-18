/**
 * @license
 *
 * This code is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * See the LICENSE file for details.
 * Full license text: https://creativecommons.org/licenses/by/4.0/
 * Copyright (c) 2024 Aaron Ragudos
 */

/**
 * @fileoverview re-exports all public PNG-related modules
 *
 * @module core/png
 */

const PngDecoder = require("./decoder");
const PngDisplayReader = require("./reader");

module.exports = {
	PngDecoder,
	PngDisplayReader,
};
