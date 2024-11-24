import { MessageTypeReq, MessageTypeRes } from '@/constants';
import { User, UserData } from '@/models';
import { IncomingMessage, ServerResponse } from 'node:http';

export interface ControllerProps {
	req?: IncomingMessage;
	res: ServerResponse;
}

export interface Repository<T, TData> {
	getAll(): Promise<T[]>;
	getById(id: string): Promise<T | undefined>;
	create(data: TData): Promise<T | undefined>;
	update(id: string, data: Partial<TData>): Promise<T | undefined>;
	delete(id: string): Promise<boolean>;
}

type MessageData = User[] | UserData | boolean;

export interface Message {
	type: MessageTypeRes | MessageTypeReq;
	data: MessageData;
}
