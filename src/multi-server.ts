import cluster from 'node:cluster';
import { LoadBalancer, getWorkers } from '@/scaling';
import { startServer } from './server';
import { UserRepository } from './repositories';
import { DB } from './db';
import { Message } from './types';
import { isNonEmptyString, isObject, isValidUserData, isValidUserProperty } from './validators';
import { UserService } from './services';
import { UsersController } from './controllers';
import { IncomingMessage } from 'node:http';

const BASE_PORT = Number(process.env.PORT ?? 4000);

if (cluster.isPrimary) {
	console.log(`Primary process ${process.pid} is running`);

	const usersRepository = new UserRepository(DB);
	const usersService = new UserService(usersRepository);
	const dbManager = new UsersController(usersService);
	// const dbManager = new UserRepository(DB);

	cluster.on('message', async (worker, message: IncomingMessage) => {
		// const incomingMessage: IncomingMessage = {
		// 	method: message.method,
		// 	url: message.url,
		// 	headers: message.headers,
		// 	socket: message.socket,
		// 	statusCode: message.statusCode,
		// 	statusMessage: message.statusMessage,
		// };
		switch (message.type) {
			case USER_CLUSTER_ACTIONS_RES.GET: {
				try {
					const users = await dbManager.getUsers();
					const messageData = message.data as Message;
					worker.send({ type: USER_CLUSTER_ACTIONS_REQ.GET, data: users });
				} catch (error) {
					if (error instanceof Error) {
						worker.send({ type: USER_CLUSTER_ACTIONS_REQ.GET, data: error.message });
					}
				}

				break;
			}
			case USER_CLUSTER_ACTIONS_RES.GET_BY_ID:
				if (isNonEmptyString(message.data)) {
					try {
						const user = await dbManager.getById(message.data);
						worker.send({ type: USER_CLUSTER_ACTIONS_REQ.GET_BY_ID, data: user });
					} catch (error) {
						if (error instanceof Error) {
							worker.send({ type: USER_CLUSTER_ACTIONS_REQ.GET_BY_ID, data: error.message });
						}
					}
				}
				break;
			case USER_CLUSTER_ACTIONS_RES.CREATE:
				if (isValidUserData(message.data)) {
					try {
						const user = await dbManager.create(message.data);
						worker.send({ type: USER_CLUSTER_ACTIONS_REQ.CREATE, data: user });
					} catch (error) {
						if (error instanceof Error) {
							worker.send({ type: USER_CLUSTER_ACTIONS_REQ.CREATE, data: error.message });
						}
					}
				}
				break;
			case USER_CLUSTER_ACTIONS_RES.UPDATE: {
				if (!isObject(message.data) || !('id' in message.data)) {
					return;
				}
				const { id, ...userProperty } = message.data;
				if (isValidUserProperty(userProperty) && isNonEmptyString(id)) {
					try {
						const user = await dbManager.update(id, userProperty);
						worker.send({ type: USER_CLUSTER_ACTIONS_REQ.UPDATE, data: user });
					} catch (error) {
						if (error instanceof Error) {
							worker.send({ type: USER_CLUSTER_ACTIONS_REQ.UPDATE, data: error.message });
						}
					}
				}
				break;
			}
			case USER_CLUSTER_ACTIONS_RES.DELETE: {
				if (isNonEmptyString(message.data)) {
					try {
						const response = await dbManager.delete(message.data);
						worker.send({ type: USER_CLUSTER_ACTIONS_REQ.DELETE, data: response });
					} catch (error) {
						if (error instanceof Error) {
							worker.send({ type: USER_CLUSTER_ACTIONS_REQ.DELETE, data: error.message });
						}
					}
				}
				break;
			}
		}
	});

	const workers = getWorkers(cluster, BASE_PORT);

	const loadBalancer = new LoadBalancer(cluster, workers, BASE_PORT);

	loadBalancer.start();
	loadBalancer.handleWorkerCrash();
} else {
	const WORKER_PORT = Number(process.env.WORKER_PORT);
	startServer(WORKER_PORT);
}
