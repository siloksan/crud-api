import { HttpMethods } from '@/constants';
import { RouteNode, routes } from './routes';

export function addRoute(method: HttpMethods, path: string, handler: RouteNode['handler']) {
	let current = routes;
	current.children[method] ??= { children: {} };

	current = current.children[method]!;

	if (!current) {
		throw new Error(`Failed to initialize method node for ${method}`);
	}

	const parts = path.split('/').filter(Boolean);
	for (const part of parts) {
		current.children[part] ??= { children: {} };
		current = current.children[part]!;
	}

	current.handler = handler;
}
