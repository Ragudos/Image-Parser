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

		for (let y = 0; y < this.#data.header.height; ++y) {
			for (let x = 0; x < this.#data.header.width; ++x) {
				const pixelIdx = (y * this.#data.header.width + x) * 4;

				const pixel = this.#data.data[idx++];

				imgData.data[pixelIdx] = pixel;
				imgData.data[pixelIdx + 1] = pixel;
				imgData.data[pixelIdx + 2] = pixel;
				imgData.data[pixelIdx + 3] = 255;
			}
		}

		this.#ctx.putImageData(imgData, 0, 0);
	}

	/**
	 * @param {ImageData} imgData
	 */
	#renderRgb(imgData) {
		throw new Error("Method not implemented.");
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
		throw new Error("Method not implemented.");
	}

	/**
	 * @param {ImageData} imgData
	 */
	#renderRgba(imgData) {
		throw new Error("Method not implemented.");
	}
}

module.exports = PngDisplayReader;
