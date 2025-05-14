import { ControllerProps } from '@/types';

export interface RouteNode {
	children: Record<string, RouteNode>;
	handler?: (args: ControllerProps) => Promise<void>;
}

export const DYNAMIC_PATH = ':id';

export const ROUTES = {
	API: {
		USERS: {
			ROUTE: 'api/users',
			ID: `api/users/${DYNAMIC_PATH}`,
		},
	},
} as const;

export const routes: RouteNode = { children: {} };
