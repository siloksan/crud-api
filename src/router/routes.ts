import { DYNAMIC_PATH } from '@/constants';
import { ControllerProps } from '@/types';

export interface RouteNode {
	children: Record<string, RouteNode>;
	handler?: (args: ControllerProps) => Promise<void>;
}

export const ROUTES = {
	API: {
		USERS: {
			ROUTE: 'api/users',
			ID: `api/users/${DYNAMIC_PATH}`,
		},
	},
};

export const routes: RouteNode = { children: {} };
