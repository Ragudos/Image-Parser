const {
	afterAll,
	beforeAll,
	jest: { spyOn },
} = require("@jest/globals");

beforeAll(() => {
	spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
	console.error.mockRestore();
});
