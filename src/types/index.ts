import { IncomingMessage, ServerResponse } from 'node:http';

export interface ControllerProps {
	req?: IncomingMessage;
	res: ServerResponse;
}
