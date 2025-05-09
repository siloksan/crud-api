import { DBActions } from '@/constants';
import { User } from '@/models';
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

export type IncomingData = Partial<User> | string | undefined;

export interface MessageToDB {
	type: DBActions;
	data: IncomingData;
}

interface SuccessData {
	isError: false;
	data: User[] | User | boolean | string;
}

interface ErrorData {
	isError: true;
	errorMessage: string;
}

export type OutComingData = SuccessData | ErrorData;

export interface MessageFromDB {
	type: DBActions;
	data: OutComingData;
}
