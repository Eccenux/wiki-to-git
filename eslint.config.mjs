import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		name: "project/javascript",
		files: ["**/*.{js,mjs,cjs}"],

		plugins: {
			js,
		},

		extends: ["js/recommended"],

		languageOptions: {
			globals: {
				...globals.node,

				// "$": "readonly",
				// "mw": "readonly",
			},

			"ecmaVersion": "latest",
			"sourceType": "module",
		},
		"rules": {
			"no-prototype-builtins": "off",
			"indent": [
				"error",
				"tab",
				{
					"SwitchCase": 1,
				},
			],
			//"array-bracket-newline": ["error", { "multiline": true, "minItems": 3 }],
			//"array-element-newline": ["error", { "multiline": true }]
			"array-element-newline": ["error", "consistent"],
		},
	},
]);