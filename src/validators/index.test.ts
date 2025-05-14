import { isValidUserProperty } from './index';
import { UserData } from '@/models';

describe('isValidUserProperty', () => {
	it('should return false for non-object input', () => {
		expect(isValidUserProperty('string')).toBe(false);
		expect(isValidUserProperty(123)).toBe(false);
		expect(isValidUserProperty(null)).toBe(false);
		expect(isValidUserProperty(undefined)).toBe(false);
	});

	it('should return false for object with more than 3 keys', () => {
		const userData = { username: 'John', age: 30, hobbies: ['music', 'sports'], extra: 'extra' };
		expect(isValidUserProperty(userData)).toBe(false);
	});

	it("should return false for object with invalid 'username' type", () => {
		const userData = { username: 123, age: 30, hobbies: ['music', 'sports'] };
		expect(isValidUserProperty(userData)).toBe(false);
	});

	it("should return false for object with invalid 'age' type", () => {
		const userData = { username: 'John', age: '30', hobbies: ['music', 'sports'] };
		expect(isValidUserProperty(userData)).toBe(false);
	});

	it("should return false for object with invalid 'hobbies' type", () => {
		const userData = { username: 'John', age: 30, hobbies: 123 };
		expect(isValidUserProperty(userData)).toBe(false);
	});

	it('should return false for object with unknown key', () => {
		const userData = { username: 'John', age: 30, hobbies: ['music', 'sports'], unknown: 'key' };
		expect(isValidUserProperty(userData)).toBe(false);
	});

	it('should return true for valid partial user data', () => {
		const userData = { username: 'John', age: 30 };
		expect(isValidUserProperty(userData)).toBe(true);
	});

	it('should return true for valid full user data', () => {
		const userData: UserData = { username: 'John', age: 30, hobbies: ['music', 'sports'] };
		expect(isValidUserProperty(userData)).toBe(true);
	});
});
