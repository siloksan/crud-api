import { USER_CLUSTER_ACTIONS_REQ, USER_CLUSTER_ACTIONS_RES } from '@/constants';
import { User, UserData } from '@/models';
import { Message, Repository } from '@/types';
import { isValidUser } from '@/validators';

export class ClusterUserRepository implements Repository<User, UserData> {
	getAll(): Promise<User[]> {
		return new Promise((resolve) => {
			const onMessage = (message: Message) => {
				if (message.type === USER_CLUSTER_ACTIONS_REQ.GET) {
					process.off('message', onMessage);
					if (Array.isArray(message.data) && message.data.every((item) => isValidUser(item))) {
						resolve(message.data);
					} else {
						resolve([]);
					}
				}
			};
			process.on('message', onMessage);
			process.send?.({ type: USER_CLUSTER_ACTIONS_RES.GET });
		});
	}

	getById(id: string): Promise<User> {
		return new Promise((resolve) => {
			const onMessage = (message: Message) => {
				if (message.type === USER_CLUSTER_ACTIONS_REQ.GET_BY_ID) {
					process.off('message', onMessage);
					if (isValidUser(message.data)) {
						resolve(message.data);
					}
				}
			};
			process.on('message', onMessage);
			process.send?.({ type: USER_CLUSTER_ACTIONS_RES.GET_BY_ID, data: id });
		});
	}
	create(data: UserData): Promise<User> {
		return new Promise((resolve) => {
			const onMessage = (message: Message) => {
				if (message.type === USER_CLUSTER_ACTIONS_REQ.CREATE) {
					process.off('message', onMessage);
					if (isValidUser(message.data)) {
						resolve(message.data);
					}
				}
			};
			process.on('message', onMessage);
			process.send?.({ type: USER_CLUSTER_ACTIONS_RES.CREATE, data });
		});
	}
	update(id: string, data: Partial<UserData>): Promise<User> {
		return new Promise((resolve) => {
			const onMessage = (message: Message) => {
				if (message.type === USER_CLUSTER_ACTIONS_REQ.UPDATE) {
					process.off('message', onMessage);
					if (isValidUser(message.data)) {
						resolve(message.data);
					}
				}
			};
			process.on('message', onMessage);
			const messageData = { id, ...data };
			process.send?.({ type: USER_CLUSTER_ACTIONS_RES.UPDATE, data: messageData });
		});
	}
	delete(id: string): Promise<boolean> {
		return new Promise((resolve) => {
			const onMessage = (message: Message) => {
				if (message.type === USER_CLUSTER_ACTIONS_REQ.DELETE) {
					process.off('message', onMessage);
					if (typeof message.data === 'boolean') {
						resolve(message.data);
					}
				}
			};
			process.on('message', onMessage);
			process.send?.({ type: USER_CLUSTER_ACTIONS_RES.DELETE, data: id });
		});
	}
}
