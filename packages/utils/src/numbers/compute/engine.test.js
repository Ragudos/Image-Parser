const { it, describe, expect } = require("@jest/globals");

const {
	isSignedByte,
	isSignedShort,
	isSignedInt,
	isUnsignedByte,
	isUnsignedShort,
	getNumberType,
} = require("./engine");
const {
	MAX_INT_8BIT,
	MIN_INT_8BIT,
	MIN_INT_16BIT,
	MAX_INT_16BIT,
	MAX_INT_32BIT,
	MAX_UINT_32BIT,
	MIN_INT_32BIT,
	MAX_UINT_16BIT,
	MAX_UINT_8BIT,
} = require("../const");

describe("Functions in utils/numbers/compute/engine work when", () => {
	describe("number types are recognized properly when it", () => {
		const signed8BitInts = [MIN_INT_8BIT, -1, -29, 0, 29, 1, MAX_INT_8BIT];
		const signed16BitInts = [
			MIN_INT_16BIT,
			-20_000,
			-1,
			0,
			1,
			30_000,
			MAX_INT_16BIT,
		];
		const invalidSigned8BitInts = [-129, 128, -2000, 400];
		const invalidSigned16BitInts = [-32_769, 32_768];

		it("recognizes an 8-bit signed integer when using isSignedByte()", () => {
			for (const int of signed8BitInts) {
				expect(isSignedByte(int)).toBeTruthy();
			}

			for (const int of invalidSigned8BitInts) {
				expect(isSignedByte(int)).toBeFalsy();
			}
		});

		it("recognizes a 16-bit signed integer when using isSignedShort()", () => {
			for (const int of signed16BitInts) {
				expect(isSignedShort(int)).toBeTruthy();
			}

			for (const int of invalidSigned16BitInts) {
				expect(isSignedShort(int)).toBeFalsy();
			}
		});

		it("recognizes a 32-bit signed integer when using isSignedInt()", () => {
			expect(isSignedInt(MAX_UINT_32BIT)).toBeFalsy();
			expect(isSignedInt(MAX_INT_32BIT)).toBeTruthy();
			expect(isSignedInt(MIN_INT_32BIT)).toBeTruthy();
		});

		it("recognizes an 8-bit unsigned integer when using isUnsignedByte()", () => {
			expect(isUnsignedByte(255)).toBeTruthy();
			expect(isUnsignedByte(0)).toBeTruthy();
			expect(isUnsignedByte(256)).toBeFalsy();
			expect(isUnsignedByte(-128)).toBeFalsy();
			expect(isUnsignedByte(-1)).toBeFalsy();
		});

		it("recognizes a 16-bit unsigned integer when using isUnsignedShort()", () => {
			expect(isUnsignedShort(255)).toBeTruthy();
			expect(isUnsignedShort(0)).toBeTruthy();
			expect(isUnsignedShort(MAX_UINT_16BIT)).toBeTruthy();
			expect(isUnsignedShort(MAX_UINT_16BIT + 1)).toBeFalsy();
			expect(isUnsignedShort(-1)).toBeFalsy();
			expect(isUnsignedShort(MIN_INT_16BIT)).toBeFalsy();
		});

		it("successfully gets the integer type of a number", () => {
			expect(getNumberType(MAX_UINT_8BIT)).toBe("uint8");
			expect(getNumberType(0)).toBe("int8");
			expect(getNumberType(MIN_INT_8BIT)).toBe("int8");
			expect(getNumberType(MAX_UINT_8BIT + 1)).toBe("int16");
			expect(getNumberType(-129)).toBe("int16");
			expect(getNumberType(MAX_INT_8BIT)).toBe("int8");
			expect(getNumberType(MAX_UINT_32BIT)).toBe("uint32");
			expect(getNumberType(128)).toBe("uint8");
			expect(getNumberType(MAX_UINT_16BIT)).toBe("uint16");
			expect(getNumberType(MAX_UINT_16BIT + 1)).toBe("int32");
		});
	});
});
