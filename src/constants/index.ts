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

export const DYNAMIC_PATH = ':id';

export type HttpMethods = keyof typeof HTTP_METHODS;

export const STATUS = {
	OK: 200,
	CREATED: 201,
	BAD_REQUEST: 400,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
} as const;

export const STATUS_MESSAGES = {
	[STATUS.OK]: 'OK',
	[STATUS.BAD_REQUEST]: {
		badRequest: 'Bad Request',
		invalidId: 'Invalid ID',
		invalidData: 'Does not contain required fields',
	},
	[STATUS.NOT_FOUND]: 'Not Found',
	[STATUS.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
	[STATUS.CREATED]: 'Created',
} as const;
