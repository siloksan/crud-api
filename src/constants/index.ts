export const HTTP_METHODS = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE',
} as const;

export const DYNAMIC_PATH = ':id';

export type HttpMethods = keyof typeof HTTP_METHODS;

export const STATUS = {
	OK: 200,
	CREATED: 201,
	DELETED: 204,
	BAD_REQUEST: 400,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
	SERVICE_UNAVAILABLE: 503,
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
	[STATUS.SERVICE_UNAVAILABLE]: 'Service Unavailable',
} as const;

export const USER_CLUSTER_ACTIONS_RES = {
	GET: 'getUsersRes',
	GET_BY_ID: 'getByIdRes',
	CREATE: 'createRes',
	UPDATE: 'updateRes',
	DELETE: 'deleteRes',
} as const;

export const USER_CLUSTER_ACTIONS_REQ = {
	GET: 'getUsersReq',
	GET_BY_ID: 'getByIdReq',
	CREATE: 'createReq',
	UPDATE: 'updateReq',
	DELETE: 'deleteReq',
} as const;

export type MessageTypeRes = (typeof USER_CLUSTER_ACTIONS_RES)[keyof typeof USER_CLUSTER_ACTIONS_RES];
export type MessageTypeReq = (typeof USER_CLUSTER_ACTIONS_REQ)[keyof typeof USER_CLUSTER_ACTIONS_REQ];
