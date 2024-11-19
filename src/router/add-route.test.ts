import { addRoute } from './add-route';
import { routes } from './routes';

describe('addRoute function', () => {
	beforeEach(() => {
		routes.children = {};
	});

	test('should add a route with a new method', () => {
		const handler = () => {};
		addRoute('GET', 'users', handler);

		expect(routes.children.GET).toBeDefined();
		expect(routes.children.GET?.children.users).toBeDefined();
		expect(routes.children.GET?.children.users?.handler).toBe(handler);
	});

	test('should add a route with a path that has multiple parts', () => {
		const handler = () => {};
		addRoute('GET', 'users/:id', handler);
		expect(routes.children.GET?.children.users).toBeDefined();
		expect(routes.children.GET?.children.users?.children[':id']).toBeDefined();
		expect(routes.children.GET?.children.users?.children[':id']?.handler).toBe(handler);
	});

	test('should add multiple methods', () => {
		const getHandler = () => {},
			postHandler = () => {};

		addRoute('GET', 'users', getHandler);
		addRoute('POST', 'users', postHandler);

		expect(routes.children.GET?.children.users?.handler).toBe(getHandler);
		expect(routes.children.POST?.children.users?.handler).toBe(postHandler);
	});

	test('should add multiple paths', () => {
		const getHandler1 = () => {},
			getHandler2 = () => {};

		addRoute('GET', 'users', getHandler1);
		addRoute('GET', 'users/:id', getHandler2);

		expect(routes.children.GET?.children.users?.handler).toBe(getHandler1);
		expect(routes.children.GET?.children.users?.children[':id']?.handler).toBe(getHandler2);
	});
});
