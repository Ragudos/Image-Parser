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
	 * @param {PngHeader} header
	 * @param {Uint8Array} data
	 * @param {Uint8Array | null} plte
	 */
	constructor(header, data, plte) {
		this.#header = header;
		this.#data = data;
		this.#plte = plte;
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
}

module.exports = PngData;
