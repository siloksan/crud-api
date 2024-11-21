import { DYNAMIC_PATH, HttpMethods, STATUS, STATUS_MESSAGES } from '@/constants';
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
		throw new Error(`${STATUS.BAD_REQUEST}||${STATUS_MESSAGES[STATUS.BAD_REQUEST].badRequest}`);
	}

	const parts = url.split('/').filter(Boolean);

	current = current.children[method]!;

	for (const part of parts) {
		if (current.children[part]) {
			current = current.children[part]!;
		} else if (current.children[DYNAMIC_PATH]) {
			current = current.children[DYNAMIC_PATH];
		} else {
			throw new Error(`${STATUS.NOT_FOUND}||${STATUS_MESSAGES[STATUS.NOT_FOUND]}`);
		}
	}

	if (!current.handler) {
		throw new Error(`${STATUS.NOT_FOUND}||${STATUS_MESSAGES[STATUS.NOT_FOUND]}`);
	}

	return current.handler;
}
