import js from '@eslint/js';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
	js.configs.recommended,
	{
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.node,
			},
		},
		plugins: {
			prettier: prettierPlugin,
			'@typescript-eslint': tsPlugin,
		},
		rules: {
			...prettierConfig.rules,
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'prettier/prettier': 'warn',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
		},
		settings: {
			'import/resolver': {
				typescript: {
					project: './tsconfig.json',
				},
			},
		},
	},
];
