import { UserData } from '@/models';

export function isValidUserData(user: unknown): user is UserData {
	if (typeof user !== 'object' || user === null) {
		return false;
	}
	if (!('name' in user) || !('age' in user) || !('hobbies' in user)) {
		return false;
	}

	return typeof user.name === 'string' && typeof user.age === 'number' && Array.isArray(user.hobbies);
}
