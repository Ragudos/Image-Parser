const PngHeader = require("./header");
const { PNG_FILTER_TYPES } = require("../const");
const { MAX_UINT_8BIT } = require("@image-parser/utils");

class PngFilter {
	/**
	 * @param {Uint8Array} decompressedData
	 * @param {PngHeader} header
	 *
	 * @returns {Uint8Array} The uncompressed data with the filter reversed;
	 */
	static reversePngFilter(decompressedData, header) {
		let i = 0;
		let prevScanline;
		const res = new Uint8Array(
			header.realWidth * header.height + header.height
		);

		for (let y = 0; y < header.height; ++y) {
			const filterType = decompressedData[i++];
			const currScanline = decompressedData.subarray(
				i,
				(i += header.realWidth)
			);
			const unfilteredScanline = PngFilter.#reversePngFilterPicker(
				filterType,
				header,
				currScanline,
				prevScanline
			);
			const startOfCurrUnfilteredScanline = i - header.realWidth - y - 1;

			res.set(unfilteredScanline, startOfCurrUnfilteredScanline);
			prevScanline = currScanline;
		}

		return res;
	}

	/**
	 * @param {number} filterType
	 * @param {PngHeader} header
	 * @param {Uint8Array} currScanline
	 * @param {Uint8Array | undefined} prevScanline
	 *
	 * @returns {Uint8Array}
	 */
	static #reversePngFilterPicker(
		filterType,
		header,
		currScanline,
		prevScanline
	) {
		switch (filterType) {
			case PNG_FILTER_TYPES.None:
				return currScanline;

			case PNG_FILTER_TYPES.Sub:
				return PngFilter.#reversePngFilterSub(header, currScanline);

			case PNG_FILTER_TYPES.Up:
				return PngFilter.#reversePngFilterUp(
					header,
					currScanline,
					prevScanline
				);

			case PNG_FILTER_TYPES.Average:
				return PngFilter.#reversePngFilterAverage(
					header,
					currScanline,
					prevScanline
				);

			case PNG_FILTER_TYPES.Paeth:
				return PngFilter.#reversePngFilterPaeth(
					header,
					currScanline,
					prevScanline
				);

			default:
				throw new Error(`Unknown filter type: ${filterType}`);
		}
	}

	/**
	 * @param {PngHeader} header
	 * @param {Uint8Array} currScanline
	 *
	 * @returns {Uint8Array}
	 */
	static #reversePngFilterSub(header, currScanline) {
		for (let x = header.bpp; x < currScanline.length; ++x) {
			const raw = currScanline[x - header.bpp];

			currScanline[x] = (currScanline[x] + raw) & MAX_UINT_8BIT;
		}

		return currScanline;
	}

	/**
	 * @param {PngHeader} header
	 * @param {Uint8Array} currScanline
	 * @param {Uint8Array | undefined} prevScanline
	 *
	 * @returns {Uint8Array}
	 */
	static #reversePngFilterUp(header, currScanline, prevScanline) {
		if (!prevScanline) {
			return currScanline;
		}

		for (let x = 0; x < currScanline.length; ++x) {
			currScanline[x] =
				(currScanline[x] + prevScanline[x]) & MAX_UINT_8BIT;
		}

		return currScanline;
	}

	/**
	 * @param {PngHeader} header
	 * @param {Uint8Array} currScanline
	 * @param {Uint8Array | undefined} prevScanline
	 *
	 * @returns {Uint8Array}
	 */
	static #reversePngFilterAverage(header, currScanline, prevScanline) {
		if (!prevScanline) {
			for (let x = header.bpp; x < currScanline.length; ++x) {
				const raw = currScanline[x - header.bpp];

				currScanline[x] =
					(currScanline[x] + Math.floor(raw / 2)) & MAX_UINT_8BIT;
			}

			return currScanline;
		}

		for (let x = 0; x < header.bpp; ++x) {
			const prior = prevScanline[x];

			currScanline[x] =
				(currScanline[x] + Math.floor(prior / 2)) & MAX_UINT_8BIT;
		}

		for (let x = header.bpp; x < currScanline.length; ++x) {
			const raw = currScanline[x - header.bpp];
			const prior = prevScanline[x];

			currScanline[x] =
				(currScanline[x] + Math.floor((raw + prior) / 2)) &
				MAX_UINT_8BIT;
		}

		return currScanline;
	}

	/**
	 * @param {PngHeader} header
	 * @param {Uint8Array} currScanline
	 * @param {Uint8Array | undefined} prevScanline
	 *
	 * @returns {Uint8Array}
	 */
	static #reversePngFilterPaeth(header, currScanline, prevScanline) {
		if (!prevScanline) {
			for (let x = header.bpp; x < currScanline.length; ++x) {
				const raw = currScanline[x - header.bpp];

				currScanline[x] =
					(currScanline[x] + this.#paethPredictor(raw, 0, 0)) &
					MAX_UINT_8BIT;
			}

			return currScanline;
		}

		for (let x = 0; x < header.bpp; ++x) {
			const prior = prevScanline[x];

			currScanline[x] =
				(currScanline[x] + this.#paethPredictor(0, prior, 0)) &
				MAX_UINT_8BIT;
		}

		for (let x = header.bpp; x < currScanline.length; ++x) {
			const raw = currScanline[x - header.bpp];
			const prior = prevScanline[x];
			const upperLeft = prevScanline[x - header.bpp];

			currScanline[x] =
				(currScanline[x] +
					this.#paethPredictor(raw, prior, upperLeft)) &
				MAX_UINT_8BIT;
		}

		return currScanline;
	}

	/**
	 * @param {number} left
	 * @param {number} above
	 * @param {number} upperLeft
	 *
	 * @returns {number}
	 */
	static #paethPredictor(left, above, upperLeft) {
		const paeth = left + above - upperLeft;
		const paethLeft = Math.abs(paeth - left);
		const paethAbove = Math.abs(paeth - above);
		const paethUpperLeft = Math.abs(paeth - upperLeft);

		if (paethLeft <= paethAbove && paethLeft <= paethUpperLeft) {
			return left;
		}

		if (paethAbove <= paethUpperLeft) {
			return above;
		}

		return upperLeft;
	}
}

module.exports = PngFilter;
