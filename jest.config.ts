import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testPathIgnorePatterns: ['/node_modules/'],
	testMatch: ['**/?(*.)+(test).ts'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	restoreMocks: true,
	resetMocks: true,
	moduleDirectories: ['node_modules', '<rootDir>/src'],
	moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};

export default config;
