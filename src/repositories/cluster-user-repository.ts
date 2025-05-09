import { DBActions, DB_ACTIONS } from '@/constants';
import { User, UserData } from '@/models';
import { IncomingData, MessageFromDB, MessageToDB, Repository } from '@/types';

export class ClusterUserRepository implements Repository<User, UserData> {
	private sendMessageToDB(incomingMessage: MessageToDB) {
		process.send?.(incomingMessage);
	}

	private getMessageFromDB<T>(dbAction: DBActions, data?: IncomingData): Promise<T> {
		return new Promise((resolve, reject) => {
			const onMessage = (message: MessageFromDB) => {
				if (message.type === dbAction) {
					process.off('message', this.getMessageFromDB);
					if (message.data.isError) {
						reject(new Error(message.data.errorMessage));
					} else {
						resolve(message.data as T);
					}
				}
			};

			process.on('message', onMessage);
			this.sendMessageToDB({ type: dbAction, data });
		});
	}

	getAll(): Promise<User[]> {
		return this.getMessageFromDB<User[]>(DB_ACTIONS.GET_ALL);
	}

	getById(id: string): Promise<User> {
		return this.getMessageFromDB<User>(DB_ACTIONS.GET_BY_ID, id);
	}
	create(data: UserData): Promise<User> {
		return this.getMessageFromDB<User>(DB_ACTIONS.CREATE, data);
	}
	update(id: string, data: Partial<UserData>): Promise<User> {
		return this.getMessageFromDB<User>(DB_ACTIONS.UPDATE, { id, ...data });
	}
	delete(id: string): Promise<boolean> {
		return this.getMessageFromDB<boolean>(DB_ACTIONS.DELETE, id);
	}
}
