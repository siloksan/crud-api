export const HTTP_METHODS = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE',
} as const;

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

export const ACTIONS_TYPES = {
	GET_USERS: 'GET_USERS',
	GET_USER_BY_ID: 'GET_USER_BY_ID',
	CREATE_USERS: 'CREATE_USERS',
	UPDATE_USER: 'UPDATE_USER',
	DELETE_USER: 'DELETE_USER',
	ERROR: 'ERROR',
} as const;

// export const USER_CLUSTER_ACTIONS_REQ = {
// 	GET: 'getUsersReq',
// 	GET_BY_ID: 'getByIdReq',
// 	CREATE: 'createReq',
// 	UPDATE: 'updateReq',
// 	DELETE: 'deleteReq',
// } as const;

export type ActionsType = (typeof ACTIONS_TYPES)[keyof typeof ACTIONS_TYPES];
// export type MessageTypeReq = (typeof USER_CLUSTER_ACTIONS_REQ)[keyof typeof USER_CLUSTER_ACTIONS_REQ];
