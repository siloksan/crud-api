import cluster from 'node:cluster';
import { LoadBalancer, getWorkers } from '@/scaling';
import { startServer } from './server';
import { UserRepository } from './repositories';
import { DB } from './db';
import { USER_CLUSTER_ACTIONS_RES, USER_CLUSTER_ACTIONS_REQ } from './constants';
import { Message } from './types';
import { isNonEmptyString, isObject, isValidUserData, isValidUserProperty } from './validators';

const BASE_PORT = Number(process.env.PORT ?? 4000);

if (cluster.isPrimary) {
	console.log(`Primary process ${process.pid} is running`);

	const dbManager = new UserRepository(DB);

	cluster.on('message', async (worker, message: Message) => {
		switch (message.type) {
			case USER_CLUSTER_ACTIONS_RES.GET: {
				const users = await dbManager.getAll();
				worker.send({ type: USER_CLUSTER_ACTIONS_REQ.GET, data: users });
				break;
			}
			case USER_CLUSTER_ACTIONS_RES.GET_BY_ID:
				if (isNonEmptyString(message.data)) {
					const user = await dbManager.getById(message.data);
					worker.send({ type: USER_CLUSTER_ACTIONS_REQ.GET_BY_ID, data: user });
				}
				break;
			case USER_CLUSTER_ACTIONS_RES.CREATE:
				if (isValidUserData(message.data)) {
					const user = await dbManager.create(message.data);
					worker.send({ type: USER_CLUSTER_ACTIONS_REQ.CREATE, data: user });
				}
				break;
			case USER_CLUSTER_ACTIONS_RES.UPDATE: {
				if (!isObject(message.data) || !('id' in message.data)) {
					return;
				}
				const { id, ...userProperty } = message.data;
				if (isValidUserProperty(userProperty) && isNonEmptyString(id)) {
					const user = await dbManager.update(id, userProperty);
					worker.send({ type: USER_CLUSTER_ACTIONS_REQ.UPDATE, data: user });
				}
				break;
			}
			case USER_CLUSTER_ACTIONS_RES.DELETE: {
				if (isNonEmptyString(message.data)) {
					const response = await dbManager.delete(message.data);
					worker.send({ type: USER_CLUSTER_ACTIONS_REQ.DELETE, data: response });
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
