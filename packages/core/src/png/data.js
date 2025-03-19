const PngHeader = require("./header");

class PngData {
	/**
	 * @type {PngHeader}
	 */
	#header;
	/**
	 * @type {Uint8Array}
	 */
	#data;
	/**
	 * @type {Uint8Array | null}
	 */
	#plte;
	/**
	 * @type {number}
	 */
	#bpp;

	/**
	 * @param {PngHeader} header
	 * @param {Uint8Array} data
	 * @param {Uint8Array | null} plte
	 * @param {number} bpp
	 */
	constructor(header, data, plte, bpp) {
		this.#header = header;
		this.#data = data;
		this.#plte = plte;
		this.#bpp = bpp;
	}

	get header() {
		return this.#header;
	}

	get data() {
		return this.#data;
	}

	get plte() {
		return this.#plte;
	}

	get bpp() {
		return this.#bpp;
	}
}

module.exports = PngData;
