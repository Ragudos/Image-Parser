const { describe, it, expect } = require("@jest/globals");
const {
	bytesTo16BitUint,
	bytesTo24BitUint,
	bytesTo32BitUint,
} = require("./conversion");
const {
	MAX_UINT_16BIT,
	MAX_UINT_8BIT,
	MAX_UINT_24BIT,
	MAX_UINT_32BIT,
} = require("../const");

describe("Stuff in utils/numbers/compute/conversion works when", () => {
	describe("it can recognize invalid input when", () => {
		it("bytesTo16BitUint() throws an error when receiving a negative byte", () => {
			expect(() => bytesTo16BitUint(-128, 0)).toThrowError(RangeError);
			expect(() => bytesTo16BitUint(255, -128)).toThrowError(RangeError);
			expect(() => bytesTo16BitUint(-1, -1)).toThrowError(RangeError);
		});

		it("bytesTo16BitUint() throws an error when receiving an invalid byte", () => {
			expect(() => bytesTo16BitUint(256, 259)).toThrowError(RangeError);
			expect(() => bytesTo16BitUint(NaN, NaN)).toThrowError(RangeError);
			expect(() => bytesTo16BitUint(255, Infinity)).toThrowError(
				RangeError
			);
		});

		it("bytesTo24BitUint() throws an error when receiving a negative byte", () => {
			expect(() => bytesTo24BitUint(-128, 0, 0)).toThrowError(RangeError);
			expect(() => bytesTo24BitUint(255, -128, 0)).toThrowError(
				RangeError
			);
			expect(() => bytesTo24BitUint(-1, -1, -1)).toThrowError(RangeError);
		});

		it("bytesTo24BitUint() throws an error when receiving an invalid byte", () => {
			expect(() => bytesTo24BitUint(256, 259, 255)).toThrowError(
				RangeError
			);
			expect(() => bytesTo24BitUint(NaN, NaN, 0)).toThrowError(
				RangeError
			);
			expect(() => bytesTo24BitUint(0, 0, Infinity)).toThrowError(
				RangeError
			);
		});

		it("bytesTo32BitUint() throws an error when receiving a negative byte", () => {
			expect(() => bytesTo32BitUint(-128, 0, 0, 0)).toThrowError(
				RangeError
			);
			expect(() => bytesTo32BitUint(255, -128, 0, 0)).toThrowError(
				RangeError
			);
			expect(() => bytesTo32BitUint(-1, -1, -1, -1)).toThrowError(
				RangeError
			);
		});

		it("bytesTo32BitUint() throws an error when receiving an invalid byte", () => {
			expect(() => bytesTo32BitUint(256, 259, 255, 258)).toThrowError(
				RangeError
			);
			expect(() => bytesTo32BitUint(NaN, NaN, 0, 1000)).toThrowError(
				RangeError
			);
			expect(() =>
				bytesTo32BitUint(0, 0, Infinity, Infinity)
			).toThrowError(RangeError);
		});
	});

	describe("it successfully converts a byte array to a number when", () => {
		it("bytesTo16BitUint can convert a 16-bit uint array to its uint16 equivalent with Big-Endianness", () => {
			expect(bytesTo16BitUint(255, 0)).toBe(65280);
			expect(bytesTo16BitUint(1, 0)).toBe(MAX_UINT_8BIT + 1);
			expect(bytesTo16BitUint(255, 255)).toBe(MAX_UINT_16BIT);
		});

		it("bytesTo16BitUint can convert a 16-bit uint array to its uint16 equivalent with Little-Endianness", () => {
			expect(bytesTo16BitUint(0, 255, true)).toBe(65280);
			expect(bytesTo16BitUint(0, 1, true)).toBe(MAX_UINT_8BIT + 1);
			expect(bytesTo16BitUint(255, 255, true)).toBe(MAX_UINT_16BIT);
		});

		it("bytesTo24BitUint can convert a 24-bit uint array to its uint24 equivalent with Big-Endianness", () => {
			expect(bytesTo24BitUint(255, 255, 0)).toBe(16776960);
			expect(bytesTo24BitUint(1, 0, 0)).toBe(MAX_UINT_16BIT + 1);
			expect(bytesTo24BitUint(255, 255, 255)).toBe(MAX_UINT_24BIT);
		});

		it("bytesTo24BitUint can convert a 24-bit uint array to its uint24 equivalent with Little-Endianness", () => {
			expect(bytesTo24BitUint(0, 255, 255, true)).toBe(16776960);
			expect(bytesTo24BitUint(0, 0, 1, true)).toBe(MAX_UINT_16BIT + 1);
			expect(bytesTo24BitUint(255, 255, 255, true)).toBe(MAX_UINT_24BIT);
		});

		it("bytesTo32BitUint can convert a 24-bit uint array to its uint24 equivalent with Big-Endianness", () => {
			expect(bytesTo32BitUint(255, 255, 255, 0)).toBe(4294967040);
			expect(bytesTo32BitUint(1, 0, 0, 0)).toBe(MAX_UINT_24BIT + 1);
			expect(bytesTo32BitUint(255, 255, 255, 255)).toBe(MAX_UINT_32BIT);
		});

		it("bytesTo32BitUint can convert a 24-bit uint array to its uint24 equivalent with Little-Endianness", () => {
			expect(bytesTo32BitUint(0, 255, 255, 255, true)).toBe(4294967040);
			expect(bytesTo32BitUint(0, 0, 0, 1, true)).toBe(MAX_UINT_24BIT + 1);
			expect(bytesTo32BitUint(255, 255, 255, 255, true)).toBe(
				MAX_UINT_32BIT
			);
		});
	});
});
