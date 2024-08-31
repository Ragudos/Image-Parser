import eslintConfig from "@eslint/js";
import jsDoc from "eslint-plugin-jsdoc";
import globals from "globals";

export default [
	eslintConfig.configs.recommended,
	{
		plugins: {
			jsdoc: jsDoc,
		},
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: "module",
			globals: {
				...globals.commonjs,
				...globals.es2020,
				...globals.browser,
			}
		},
		rules: {
			curly: ["error", "all"],
			"arrow-body-style": ["error", "as-needed"],
			semi: "error",
			"no-debugger": "off",
			"no-undef": "off",
			"semi-spacing": "error",
			"semi-style": ["error", "last"],
			"jsdoc/require-jsdoc": "warn",
			"jsdoc/require-returns": "warn",
			"jsdoc/valid-types": "error",
			"jsdoc/require-param-type": "error",
			"jsdoc/require-param-name": "error",
			"jsdoc/no-undefined-types": "error",
			"jsdoc/check-syntax": "error",
			"jsdoc/check-line-alignment": "warn",
			"jsdoc/check-indentation": "warn",
			"rest-spread-spacing": ["error", "never"],
			quotes: [
				"error",
				"double",
				{
					allowTemplateLiterals: true,
				},
			],
			"no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
				},
			],
			"object-curly-spacing": [
				"error",
				"always",
				{
					arraysInObjects: true,
					objectsInObjects: true,
				},
			],
			"comma-spacing": [
				"error",
				{
					before: false,
					after: true,
				},
			],
			"keyword-spacing": [
				"error",
				{
					before: true,
					after: true,
				},
			],
			"key-spacing": [
				"error",
				{
					beforeColon: false,
					afterColon: true,
				},
			],
			"no-multiple-empty-lines": [
				"error",
				{
					max: 2,
				},
			],
			"space-before-blocks": ["error", "always"],
			/** @see https://eslint.org/docs/latest/rules/padding-line-between-statements#rule-details */
			"padding-line-between-statements": [
				"error",
				{
					blankLine: "always",
					prev: "*",
					next: "return",
				},
				{
					blankLine: "always",
					prev: ["const", "let", "var"],
					next: "*",
				},
				{
					blankLine: "any",
					prev: ["const", "let", "var"],
					next: ["const", "let", "var"],
				},
				{
					blankLine: "always",
					prev: ["case", "default"],
					next: "*",
				},
				{
					blankLine: "always",
					prev: "if",
					next: "*",
				},
				{
					blankLine: "always",
					prev: "*",
					next: "if",
				},
			],
			"space-before-function-paren": [
				"error",
				{
					anonymous: "never",
					named: "never",
					asyncArrow: "always",
				},
			],
			"switch-colon-spacing": [
				"error",
				{
					after: true,
					before: false,
				},
			],
		},
	},
];
