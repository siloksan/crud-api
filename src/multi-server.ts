import cluster, { Worker } from 'node:cluster';
import { LoadBalancer, getWorkers } from '@/scaling';
import { startServer } from './server';
import { DBActions, DB_ACTIONS, STATUS, STATUS_MESSAGES } from './constants';
import { MessageFromDB, MessageToDB, Repository } from './types';
import { User, UserData } from './models';
import { UserRepository } from './repositories';
import { DB } from './db';

const BASE_PORT = Number(process.env.PORT ?? 4000);

if (cluster.isPrimary) {
	console.log(`Primary process ${process.pid} is running`);

	handleWorkerMessage(new UserRepository(DB));

	const workers = getWorkers(cluster, BASE_PORT);
	const loadBalancer = new LoadBalancer(cluster, workers, BASE_PORT);

	loadBalancer.start();
	loadBalancer.handleWorkerCrash();
} else {
	const WORKER_PORT = Number(process.env.WORKER_PORT);
	startServer(WORKER_PORT);
}

function handleError(worker: Worker, dBActions: DBActions, error?: unknown) {
	let errorData: MessageFromDB;
	if (error instanceof Error) {
		errorData = { type: dBActions, data: { errorMessage: error.message, isError: true } };
	} else {
		errorData = {
			type: dBActions,
			data: {
				errorMessage: `${STATUS.INTERNAL_SERVER_ERROR}||${STATUS_MESSAGES[STATUS.INTERNAL_SERVER_ERROR]}`,
				isError: true,
			},
		};
	}

	worker.send(errorData);
}

function handleWorkerMessage(usersRepository: Repository<UserData, UserData>) {
	cluster.on('message', async (worker, message: MessageToDB) => {
		switch (message.type) {
			case DB_ACTIONS.GET_ALL: {
				try {
					const users = await usersRepository.getAll();
					worker.send({ type: DB_ACTIONS.GET_ALL, data: users });
				} catch (error) {
					handleError(worker, DB_ACTIONS.GET_ALL, error);
				}

				break;
			}
			case DB_ACTIONS.GET_BY_ID: {
				try {
					const user = await usersRepository.getById(message.data as string);
					worker.send({ type: DB_ACTIONS.GET_BY_ID, data: user });
				} catch (error) {
					handleError(worker, DB_ACTIONS.GET_BY_ID, error);
				}
				break;
			}
			case DB_ACTIONS.CREATE: {
				try {
					const user = await usersRepository.create(message.data as UserData);
					worker.send({ type: DB_ACTIONS.CREATE, data: user });
				} catch (error) {
					handleError(worker, DB_ACTIONS.CREATE, error);
				}
				break;
			}
			case DB_ACTIONS.UPDATE: {
				const { id, ...userProperty } = message.data as User;
				try {
					const user = await usersRepository.update(id, userProperty);
					worker.send({ type: DB_ACTIONS.UPDATE, data: user });
				} catch (error) {
					handleError(worker, DB_ACTIONS.UPDATE, error);
				}
				break;
			}
			case DB_ACTIONS.DELETE: {
				try {
					const response = await usersRepository.delete(message.data as string);
					worker.send({ type: DB_ACTIONS.DELETE, data: response });
				} catch (error) {
					handleError(worker, DB_ACTIONS.DELETE, error);
				}
				break;
			}
			default: {
				handleError(worker, message.type);
				break;
			}
		}
	});
}
