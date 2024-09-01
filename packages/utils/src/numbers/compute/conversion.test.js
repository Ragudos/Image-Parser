const { describe, it, expect } = require("@jest/globals");
const {
	bytesTo16BitUint,
	bytesTo24BitUint,
	bytesTo32BitUint,
	bytesTo16BitInt,
	bytesTo24BitInt,
	bytesTo32BitInt,
	uint8ToBytes,
	int8ToBytes,
	uint16ToBytes,
	uint24ToBytes,
	int16ToBytes,
	int24ToBytes,
	uint32ToBytes,
	int32ToBytes,
} = require("./conversion");
const {
	MAX_UINT_16BIT,
	MAX_UINT_8BIT,
	MAX_UINT_24BIT,
	MAX_UINT_32BIT,
	MIN_INT_16BIT,
	MIN_INT_24BIT,
	MIN_INT_32BIT,
	MAX_INT_8BIT,
	MAX_INT_16BIT,
	MAX_INT_24BIT,
	MAX_INT_32BIT,
	MIN_INT_8BIT,
} = require("../const");

describe("Stuff in utils/numbers/compute/conversion works when", () => {
	describe("its byte array to number functions can recognize invalid input when", () => {
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
			expect(() => bytesTo24BitUint(256, 259, 256)).toThrowError(
				RangeError
			);
			expect(() => bytesTo24BitUint(NaN, NaN, NaN)).toThrowError(
				RangeError
			);
			expect(() =>
				bytesTo24BitUint(Infinity, Infinity, Infinity)
			).toThrowError(RangeError);
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

		it("bytesTo16BitInt() throws an error when receiving a negative byte", () => {
			expect(() => bytesTo16BitInt(-128, 0)).toThrowError(RangeError);
			expect(() => bytesTo16BitInt(255, -128)).toThrowError(RangeError);
			expect(() => bytesTo16BitInt(-1, -1)).toThrowError(RangeError);
		});

		it("bytesTo16BitInt() throws an error when receiving a invalid byte", () => {
			expect(() => bytesTo16BitInt(NaN, NaN)).toThrowError(RangeError);
			expect(() => bytesTo16BitInt(Infinity, Infinity)).toThrowError(
				RangeError
			);
			expect(() => bytesTo16BitInt(-Infinity, -Infinity)).toThrowError(
				RangeError
			);
		});

		it("bytesTo24BitInt() throws an error when receiving a negative byte", () => {
			expect(() => bytesTo24BitInt(-128, 0, -1)).toThrowError(RangeError);
			expect(() => bytesTo24BitInt(255, -128, 4)).toThrowError(
				RangeError
			);
			expect(() => bytesTo24BitInt(-1, -1, 0)).toThrowError(RangeError);
		});

		it("bytesTo24BitInt() throws an error when receiving a invalid byte", () => {
			expect(() => bytesTo24BitInt(NaN, NaN, NaN)).toThrowError(
				RangeError
			);
			expect(() =>
				bytesTo24BitInt(Infinity, Infinity, Infinity)
			).toThrowError(RangeError);
			expect(() =>
				bytesTo24BitInt(-Infinity, -Infinity, -Infinity)
			).toThrowError(RangeError);
		});

		it("bytesTo32BitInt() throws an error when receiving a negative byte", () => {
			expect(() => bytesTo32BitInt(-128, 0, -1, 0)).toThrowError(
				RangeError
			);
			expect(() => bytesTo32BitInt(255, -128, 4, -200)).toThrowError(
				RangeError
			);
			expect(() => bytesTo32BitInt(-1, -1, 0, 20)).toThrowError(
				RangeError
			);
		});

		it("bytesTo32BitInt() throws an error when receiving a invalid byte", () => {
			expect(() => bytesTo32BitInt(NaN, NaN, NaN, NaN)).toThrowError(
				RangeError
			);
			expect(() =>
				bytesTo32BitInt(Infinity, Infinity, Infinity, Infinity)
			).toThrowError(RangeError);
			expect(() =>
				bytesTo32BitInt(-Infinity, -Infinity, -Infinity, -Infinity)
			).toThrowError(RangeError);
			expect(() => bytesTo32BitInt(256, 256, 256, 256)).toThrowError(
				RangeError
			);
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

		it("bytesTo32BitUint can convert a 24-bit uint array to its uint32 equivalent with Big-Endianness", () => {
			expect(bytesTo32BitUint(255, 255, 255, 0)).toBe(4294967040);
			expect(bytesTo32BitUint(1, 0, 0, 0)).toBe(MAX_UINT_24BIT + 1);
			expect(bytesTo32BitUint(255, 255, 255, 255)).toBe(MAX_UINT_32BIT);
		});

		it("bytesTo32BitUint can convert a 24-bit uint array to its uint32 equivalent with Little-Endianness", () => {
			expect(bytesTo32BitUint(0, 255, 255, 255, true)).toBe(4294967040);
			expect(bytesTo32BitUint(0, 0, 0, 1, true)).toBe(MAX_UINT_24BIT + 1);
			expect(bytesTo32BitUint(255, 255, 255, 255, true)).toBe(
				MAX_UINT_32BIT
			);
		});

		it("bytesTo16BitInt can convert a 16-bit int array to its int16 equivalent with Big-Endianness", () => {
			expect(bytesTo16BitInt(255, 0)).toBe(-256);
			expect(bytesTo16BitInt(1, 0)).toBe(MAX_UINT_8BIT + 1);
			expect(bytesTo16BitInt(255, 255)).toBe(-1);
			expect(bytesTo16BitInt(128, 0)).toBe(MIN_INT_16BIT);
		});

		it("bytesTo16BitInt can convert a 16-bit int array to its int16 equivalent with Little-Endianness", () => {
			expect(bytesTo16BitInt(0, 255, true)).toBe(-256);
			expect(bytesTo16BitInt(0, 1, true)).toBe(MAX_UINT_8BIT + 1);
			expect(bytesTo16BitInt(255, 255, true)).toBe(-1);
			expect(bytesTo16BitInt(0, 128, true)).toBe(MIN_INT_16BIT);
		});

		it("bytesTo24BitInt can convert a 24-bit int array to its int24 equivalent with Big-Endianness", () => {
			expect(bytesTo24BitInt(255, 0, 0)).toBe(-65536);
			expect(bytesTo24BitInt(1, 0, 0)).toBe(MAX_UINT_16BIT + 1);
			expect(bytesTo24BitInt(255, 255, 255)).toBe(-1);
			expect(bytesTo24BitInt(128, 0, 0)).toBe(MIN_INT_24BIT);
		});

		it("bytesTo24BitInt can convert a 24-bit int array to its int24 equivalent with Little-Endianness", () => {
			expect(bytesTo24BitInt(0, 0, 255, true)).toBe(-65536);
			expect(bytesTo24BitInt(0, 0, 1, true)).toBe(MAX_UINT_16BIT + 1);
			expect(bytesTo24BitInt(255, 255, 255, true)).toBe(-1);
			expect(bytesTo24BitInt(0, 0, 128, true)).toBe(MIN_INT_24BIT);
		});

		it("bytesTo32BitInt can convert a 32-bit int array to its int32 equivalent with Big-Endianness", () => {
			expect(bytesTo32BitInt(255, 0, 0, 0)).toBe(-16777216);
			expect(bytesTo32BitInt(1, 0, 0, 0)).toBe(MAX_UINT_24BIT + 1);
			expect(bytesTo32BitInt(255, 255, 255, 255)).toBe(-1);
			expect(bytesTo32BitInt(128, 0, 0, 0)).toBe(MIN_INT_32BIT);
		});

		it("bytesTo32BitInt can convert a 32-bit int array to its int32 equivalent with Little-Endianness", () => {
			expect(bytesTo32BitInt(0, 0, 0, 255, true)).toBe(-16777216);
			expect(bytesTo32BitInt(0, 0, 0, 1, true)).toBe(MAX_UINT_24BIT + 1);
			expect(bytesTo32BitInt(255, 255, 255, 255, true)).toBe(-1);
			expect(bytesTo32BitInt(0, 0, 0, 128, true)).toBe(MIN_INT_32BIT);
		});
	});

	describe("its number to byte array functions successfuly handles invalid input when", () => {
		it("uint8ToBytes() throws an Error upon receiving an invalid uint8.", () => {
			expect(() => uint8ToBytes(MAX_UINT_8BIT + 1)).toThrowError(
				RangeError
			);
			expect(() => uint8ToBytes(-1)).toThrowError(RangeError);
		});

		it("int8ToBytes() throws an Error upon receiving an invalid int8.", () => {
			expect(() => int8ToBytes(MAX_INT_8BIT + 1)).toThrowError(
				RangeError
			);
			expect(() => int8ToBytes(MIN_INT_8BIT - 1)).toThrowError(
				RangeError
			);
		});

		it("uint16ToBytes() throws an Error upon receiving an invalid uint16.", () => {
			expect(() => uint16ToBytes(MAX_UINT_16BIT + 1)).toThrowError(
				RangeError
			);
			expect(() => uint16ToBytes(-1)).toThrowError(RangeError);
		});

		it("int16ToBytes() throws an Error upon receiving an invalid int16.", () => {
			expect(() => int16ToBytes(MAX_INT_16BIT + 1)).toThrowError(
				RangeError
			);
			expect(() => int16ToBytes(MIN_INT_16BIT - 1)).toThrowError(
				RangeError
			);
		});

		it("uint24ToBytes() throws an Error upon receiving an invalid uint24.", () => {
			expect(() => uint24ToBytes(MAX_UINT_24BIT + 1)).toThrowError(
				RangeError
			);
			expect(() => uint24ToBytes(-1)).toThrowError(RangeError);
		});

		it("int24ToBytes() throws an Error upon receiving an invalid int24.", () => {
			expect(() => int24ToBytes(MAX_INT_24BIT + 1)).toThrowError(
				RangeError
			);
			expect(() => int24ToBytes(MIN_INT_24BIT - 1)).toThrowError(
				RangeError
			);
		});

		it("uint32ToBytes() throws an Error upon receiving an invalid uint32.", () => {
			expect(() => uint32ToBytes(MAX_UINT_32BIT + 1)).toThrowError(
				RangeError
			);
			expect(() => uint32ToBytes(-1)).toThrowError(RangeError);
		});

		it("int32ToBytes() throws an Error upon receiving an invalid int32.", () => {
			expect(() => int32ToBytes(MAX_INT_32BIT + 1)).toThrowError(
				RangeError
			);
			expect(() => int32ToBytes(MIN_INT_32BIT - 1)).toThrowError(
				RangeError
			);
		});
	});

	describe("its number to byte array functions can skip checking when", () => {
		it("uint8ToBytes() does not throw an Error upon receing an invalid uint8, but receives skipCheck", () => {
			expect(() =>
				uint8ToBytes(MAX_UINT_8BIT + 1, true)
			).not.toThrowError(RangeError);
		});

		it("int8ToBytes() does not throw an Error upon receing an invalid int8, but receives skipCheck", () => {
			expect(() => int8ToBytes(MAX_INT_8BIT + 1, true)).not.toThrowError(
				RangeError
			);
		});

		it("uint16ToBytes() does not throw an Error upon receing an invalid uint16, but receives skipCheck", () => {
			expect(() =>
				uint16ToBytes(MAX_UINT_16BIT + 1, true)
			).not.toThrowError(RangeError);
		});

		it("int16ToBytes() does not throw an Error upon receing an invalid int16, but receives skipCheck", () => {
			expect(() =>
				int16ToBytes(MAX_INT_16BIT + 1, true)
			).not.toThrowError(RangeError);
		});

		it("uint24ToBytes() does not throw an Error upon receing an invalid uint24, but receives skipCheck", () => {
			expect(() =>
				uint24ToBytes(MAX_UINT_24BIT + 1, true)
			).not.toThrowError(RangeError);
		});

		it("int24ToBytes() does not throw an Error upon receing an invalid int24, but receives skipCheck", () => {
			expect(() =>
				int24ToBytes(MAX_INT_24BIT + 1, true)
			).not.toThrowError(RangeError);
		});

		it("uint32ToBytes() does not throw an Error upon receing an invalid uint32, but receives skipCheck", () => {
			expect(() =>
				uint32ToBytes(MAX_UINT_32BIT + 1, true)
			).not.toThrowError(RangeError);
		});

		it("int32ToBytes() does not throw an Error upon receing an invalid int32, but receives skipCheck", () => {
			expect(() =>
				int32ToBytes(MAX_INT_32BIT + 1, true)
			).not.toThrowError(RangeError);
		});
	});

	describe("its number to byte array functions returns the correct output when", () => {
		it("uint8ToBytes() returns correct output", () => {
			expect(uint8ToBytes(MAX_UINT_8BIT)).toStrictEqual([255]);
		});

		it("int8ToBytes() returns correct output", () => {
			expect(int8ToBytes(MAX_INT_8BIT)).toStrictEqual([127]);
			expect(int8ToBytes(MIN_INT_8BIT)).toStrictEqual([128]);
		});

		it("uint16ToBytes() returns correct output", () => {
			expect(uint16ToBytes(MAX_UINT_16BIT)).toStrictEqual([255, 255]);
			expect(uint16ToBytes(MAX_UINT_8BIT + 1)).toStrictEqual([1, 0]);
			expect(uint16ToBytes(MAX_UINT_8BIT + 1, false, true)).toStrictEqual(
				[0, 1]
			);
		});

		it("int16ToBytes() returns correct output", () => {
			expect(int16ToBytes(MAX_INT_16BIT)).toStrictEqual([
				MAX_INT_8BIT,
				255,
			]);
			expect(int16ToBytes(MIN_INT_16BIT)).toStrictEqual([128, 0]);
			expect(int16ToBytes(MIN_INT_16BIT, false, true)).toStrictEqual([
				0, 128,
			]);
			expect(int16ToBytes(-1)).toStrictEqual([255, 255]);
		});

		it("uint24ToBytes() returns correct output", () => {
			expect(uint24ToBytes(MAX_UINT_24BIT)).toStrictEqual([
				255, 255, 255,
			]);
			expect(uint24ToBytes(MAX_UINT_16BIT + 1)).toStrictEqual([1, 0, 0]);
			expect(
				uint24ToBytes(MAX_UINT_16BIT + 1, false, true)
			).toStrictEqual([0, 0, 1]);
			expect(uint24ToBytes(MAX_INT_24BIT)).toStrictEqual([127, 255, 255]);
			expect(uint24ToBytes(MAX_INT_24BIT, false, true)).toStrictEqual([
				255, 255, 127,
			]);
		});

		it("uint32ToBytes() returns the correct output", () => {
			expect(uint32ToBytes(MAX_UINT_32BIT)).toStrictEqual([
				255, 255, 255, 255,
			]);
			expect(uint32ToBytes(MAX_UINT_24BIT + 1)).toStrictEqual([
				1, 0, 0, 0,
			]);
			expect(
				uint32ToBytes(MAX_UINT_24BIT + 1, false, true)
			).toStrictEqual([0, 0, 0, 1]);
			expect(uint32ToBytes(MAX_INT_32BIT)).toStrictEqual([
				127, 255, 255, 255,
			]);
			expect(uint32ToBytes(MAX_INT_32BIT, false, true)).toStrictEqual([
				255, 255, 255, 127,
			]);
		});
	});
});
