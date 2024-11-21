import { findHandler } from './find-handler';
import { routes } from './routes';
import { DYNAMIC_PATH, ERROR_MESSAGES } from '@/constants';

describe('findHandler function', () => {
	beforeEach(() => {
		routes.children = {};
	});

	test('should throw error when method not found', () => {
		const method = 'POST';
		expect(() => findHandler({ url: '/users', method })).toThrow(new Error(ERROR_MESSAGES.methodNotFound(method)));
	});

	test('should throw error when route not found', () => {
		routes.children.GET = { children: {} };
		const url = '/users';
		expect(() => findHandler({ url, method: 'GET' })).toThrow(new Error(ERROR_MESSAGES.routeNotFound(url)));
	});

	test('should return handler when route found with static path', () => {
		const handler = async () => {};
		routes.children.GET = { children: { users: { children: {}, handler } } };
		expect(findHandler({ url: '/users', method: 'GET' })).toBe(handler);
	});

	test('should return handler when route found with dynamic path', () => {
		const handler = async () => {};
		routes.children.GET = { children: { users: { children: { [DYNAMIC_PATH]: { children: {}, handler } } } } };

		expect(findHandler({ url: `/users/${DYNAMIC_PATH}`, method: 'GET' })).toBe(handler);
	});

	it('should return handler when route found with multiple path parts', () => {
		const handler = async () => {};
		routes.children.POST = { children: { users: { children: { admin: { children: {}, handler } } } } };

		expect(findHandler({ url: '/users/admin', method: 'POST' })).toBe(handler);
	});
});
