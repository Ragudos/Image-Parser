/**
 * @license
 *
 * This code is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * See the LICENSE file for details.
 * Full license text: https://creativecommons.org/licenses/by/4.0/
 * Copyright (c) 2024 Aaron Ragudos
 */

const { PngDecoder } = require("@image-parser/core");

const images = new Array(115).fill(0).map((_, i) => {
	i += 1;

	if (i < 10) {
		return `00${i}`;
	}

	if (i < 100) {
		return `0${i}`;
	}

	return `${i}`;
});
/**
 * @type {HTMLCanvasElement}
 */
// @ts-ignore
const canvas = document.getElementById("canvas");
let curr = 0;
let lastTime = 0;
const fps = 4;
const interval = 1000 / fps;

/**
 * @param {number} currTime
 */
function draw(currTime) {
	if (currTime - lastTime >= interval) {
		lastTime = currTime;
		curr = (curr + 1) % images.length;

		fetch(`./assets/talents-guild/ezgif-frame-${images[curr]}.png`).then(
			(res) => {
				res.arrayBuffer().then((buf) => {
					const decoder = new PngDecoder(new Uint8Array(buf));
					const decodedData = decoder.decode();

					canvas.width = decodedData.header.width;
					canvas.height = decodedData.header.height;

					/**
					 * @type {CanvasRenderingContext2D}
					 */
					// @ts-ignore
					const ctx = canvas.getContext("2d");

					const imgData = ctx.createImageData(
						decodedData.header.width,
						decodedData.header.height
					);

					let offset = 0;

					for (let y = 0; y < decodedData.header.height; ++y) {
						for (let x = 0; x < decodedData.header.width; ++x) {
							const r = decodedData.data[offset++];
							const g = decodedData.data[offset++];
							const b = decodedData.data[offset++];

							const i = (y * decodedData.header.width + x) * 4;

							imgData.data[i] = r;
							imgData.data[i + 1] = g;
							imgData.data[i + 2] = b;
							imgData.data[i + 3] = 255;
						}
					}

					ctx.putImageData(imgData, 0, 0);

					requestAnimationFrame(draw);
				});
			}
		);
	}

	requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
