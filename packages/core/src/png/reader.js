const PngData = require("./data");

/**
 * @class PngReader
 *
 * @description Reads a decoded PNG file's IDAT chunk data
 * for display based on its metadata.
 */
class PngDisplayReader {
	/**
	 * @type {PngData}
	 */
	#data;

	/**
	 * @type {HTMLCanvasElement}
	 */
	#canvas;
	/**
	 * @type {CanvasRenderingContext2D}
	 */
	#ctx;

	/**
	 * @param {PngData} data
	 * @param {HTMLCanvasElement} canvas
	 */
	constructor(data, canvas) {
		this.#data = data;
		this.#canvas = canvas;
		this.#ctx = /** @type {CanvasRenderingContext2D} */ (
			canvas.getContext("2d")
		);
	}

	/**
	 * @description Renders the PNG data to a canvas.
	 */
	render() {
		this.#canvas.width = this.#data.header.width;
		this.#canvas.height = this.#data.header.height;

		const imgData = this.#ctx.createImageData(
			this.#data.header.width,
			this.#data.header.height
		);

		switch (this.#data.header.colorType) {
			case 0:
				this.#renderGrayscale(imgData);
				break;

			case 2:
				this.#renderRgb(imgData);
				break;

			case 3:
				this.#renderIndexed(imgData);
				break;

			case 4:
				this.#renderGrayscaleAlpha(imgData);
				break;

			case 6:
				this.#renderRgba(imgData);
				break;

			default:
				throw new Error("Unsupported color type");
		}
	}

	/**
	 * @param {ImageData} imgData
	 */
	#renderGrayscale(imgData) {
		let idx = 0;
		let dataIdx = 0;
		const len = this.#data.header.width * this.#data.header.height * 4;

		while (idx < len) {
			const rgb = this.#data.data[dataIdx++];

			const red = rgb;
			const green = rgb;
			const blue = rgb;
			const alpha = 255;

			imgData.data[idx++] = red;
			imgData.data[idx++] = green;
			imgData.data[idx++] = blue;
			imgData.data[idx++] = alpha;
		}

		this.#ctx.putImageData(imgData, 0, 0);
	}

	/**
	 * @param {ImageData} imgData
	 */
	#renderRgb(imgData) {
		let idx = 0;
		let dataIdx = 0;
		const len = this.#data.header.width * this.#data.header.height * 4;

		while (idx < len) {
			const red = this.#data.data[dataIdx++];
			const green = this.#data.data[dataIdx++];
			const blue = this.#data.data[dataIdx++];
			const alpha = 255;

			imgData.data[idx++] = red;
			imgData.data[idx++] = green;
			imgData.data[idx++] = blue;
			imgData.data[idx++] = alpha;
		}

		this.#ctx.putImageData(imgData, 0, 0);
	}

	/**
	 * @param {ImageData} imgData
	 */
	#renderIndexed(imgData) {
		throw new Error("Method not implemented.");
	}

	/**
	 * @param {ImageData} imgData
	 */
	#renderGrayscaleAlpha(imgData) {
		let idx = 0;
		let dataIdx = 0;
		const len = this.#data.header.width * this.#data.header.height * 4;

		while (idx < len) {
			const rgb = this.#data.data[dataIdx++];

			const red = rgb;
			const green = rgb;
			const blue = rgb;
			const alpha = this.#data.data[dataIdx++];

			imgData.data[idx++] = red;
			imgData.data[idx++] = green;
			imgData.data[idx++] = blue;
			imgData.data[idx++] = alpha;
		}

		this.#ctx.putImageData(imgData, 0, 0);
	}

	/**
	 * @param {ImageData} imgData
	 */
	#renderRgba(imgData) {
		let idx = 0;
		let dataIdx = 0;
		const len = this.#data.header.width * this.#data.header.height * 4;

		while (idx < len) {
			const red = this.#data.data[dataIdx++];
			const green = this.#data.data[dataIdx++];
			const blue = this.#data.data[dataIdx++];
			const alpha = this.#data.data[dataIdx++];

			imgData.data[idx++] = red;
			imgData.data[idx++] = green;
			imgData.data[idx++] = blue;
			imgData.data[idx++] = alpha;
		}

		this.#ctx.putImageData(imgData, 0, 0);
	}
}

module.exports = PngDisplayReader;
