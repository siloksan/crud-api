import { UserData } from '@/models';

export function isNonEmptyString(input?: unknown): input is string {
	return typeof input === 'string' && input?.length > 0;
}

export function isNullable(value: unknown): value is null | undefined {
	return value === null || typeof value === 'undefined';
}

export function isObject(value: unknown): value is object {
	return Object.prototype.toString.call(value) === '[object Object]';
}

function isArrayString(value: unknown): value is string[] {
	return Array.isArray(value) && value.length > 0 ? value.every((item) => typeof item === 'string') : true;
}

export function isValidUserData(user: unknown): user is UserData {
	if (!isObject(user)) {
		return false;
	}

	if (Array.from(Object.keys(user)).length !== 3) {
		return false;
	}

	if (!('name' in user) || !('age' in user) || !('hobbies' in user)) {
		return false;
	}

	return typeof user.name === 'string' && typeof user.age === 'number' && isArrayString(user.hobbies);
}

export function isValidUserProperty(userData: unknown): userData is Partial<UserData> {
	if (!isObject(userData)) {
		return false;
	}

	const allowedKeys = ['name', 'age', 'hobbies'];
	const userDataKeys = Object.keys(userData);

	if (userDataKeys.length > 3) {
		return false;
	}

	if ('name' in userData && typeof userData.name !== 'string') {
		return false;
	}

	if ('age' in userData && typeof userData.age !== 'number') {
		return false;
	}

	if ('hobbies' in userData && !isArrayString(userData.hobbies)) {
		return false;
	}

	return userDataKeys.some((key) => !allowedKeys.includes(key));
}
