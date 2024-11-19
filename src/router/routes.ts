import { IncomingMessage, ServerResponse } from 'http';

export interface RouteNode {
	children: Record<string, RouteNode>;
	handler?: (req: IncomingMessage, res: ServerResponse) => void;
}

export const routes: RouteNode = { children: {} };
