import { ControllerProps } from '@/types';

export interface RouteNode {
	children: Record<string, RouteNode>;
	handler?: (args: ControllerProps) => Promise<void>;
}

export const routes: RouteNode = { children: {} };
