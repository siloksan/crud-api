import { DYNAMIC_PATH, ERROR_MESSAGES, HttpMethods } from '@/constants';
import { routes } from './routes';

interface FindHandlerProps {
	url: string;
	method: HttpMethods;
}

/**
 * Finds the handler for a given URL and HTTP method.
 * Throws {Error} if the method or route is not found.
 */
export function findHandler({ url, method }: FindHandlerProps) {
	let current = routes;

	if (!current.children[method]) {
		throw new Error(ERROR_MESSAGES.methodNotFound(method));
	}

	const parts = url.split('/').filter(Boolean);

	current = current.children[method]!;

	for (const part of parts) {
		if (current.children[part]) {
			current = current.children[part]!;
		} else if (current.children[DYNAMIC_PATH]) {
			current = current.children[DYNAMIC_PATH];
		} else {
			throw new Error(ERROR_MESSAGES.routeNotFound(url));
		}
	}

	if (!current.handler) {
		throw new Error(ERROR_MESSAGES.routeNotFound(url));
	}

	return current.handler;
}
