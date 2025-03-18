/**
 * @license
 *
 * This code is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * See the LICENSE file for details.
 * Full license text: https://creativecommons.org/licenses/by/4.0/
 * Copyright (c) 2024 Aaron Ragudos
 */
const { PngDecoder, PngDisplayReader } = require("@image-parser/core");

window.addEventListener("DOMContentLoaded", init);

/**
 *
 */
function init() {
	const decodeBtn = document.getElementById("decode-button");

	console.log(decodeBtn);

	decodeBtn?.addEventListener("click", onDecodeBtnClick);
}

/**
 *
 */
function onDecodeBtnClick() {
	const input = /** @type {HTMLInputElement} */ (
		document.getElementById("file-input")
	);

	if (!input || !input.files || !input.files[0]) {
		return alert("Please select a file to decode.");
	}

	const file = input.files[0];
	const reader = new FileReader();

	reader.onload = onFileRead;
	reader.readAsArrayBuffer(file);
}

/**
 * @param {ProgressEvent<FileReader>} e
 * @this {FileReader}
 *
 * @returns {void}
 */
function onFileRead(e) {
	const result = this.result;

	if (!result) {
		return alert("Failed to read file.");
	}

	if (typeof result === "string") {
		const text = result;
		const decodedText = decodeURIComponent(text);
		const output = document.getElementById("output");

		if (!output) {
			return alert("Failed to find output element.");
		}

		output.textContent = decodedText;
	} else {
		const decoder = new PngDecoder(new Uint8Array(result));
		const data = decoder.decode();

		console.log(data);

		new PngDisplayReader(
			data,
			// @ts-ignore
			document.querySelector("canvas.image")
		).render();
	}
}
