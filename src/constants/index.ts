export const HTTP_METHODS = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE',
} as const;

export const ERROR_MESSAGES = {
	routeNotFound: (url: string) => `Route ${url} not found!`,
	methodNotFound: (method: HttpMethods) => `Method ${method} not found!`,
	500: 'Internal server error',
} as const;

export const DYNAMIC_PATH = '/:id';

export type HttpMethods = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];
