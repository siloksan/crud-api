import { HttpMethods } from '@/constants';
import { RouteNode, routes } from './routes';

/**
 * Adds a route to the routing tree.
 *
 * @param method - The HTTP method (e.g., 'GET', 'POST') to associate with the route.
 * @param path - The path string representing the endpoint (e.g., 'users', 'users/:id').
 * @param handler - The function to handle requests for the specified route.
 */
export function addRoute(method: HttpMethods, path: string, handler: RouteNode['handler']) {
	let current = routes;
	if (!current.children[method]) {
		current.children[method] = { children: {} };
	}

	current = current.children[method]!;

	if (!current) {
		throw new Error(`Failed to initialize method node for ${method}`);
	}

	const parts = path.split('/').filter(Boolean);
	for (const part of parts) {
		if (!current.children[part]) {
			current.children[part] = { children: {} };
		}
		current = current.children[part]!;
	}

	current.handler = handler;
}
