import dotenv from 'dotenv';
import * as http from 'node:http';
import { DYNAMIC_PATH, HTTP_METHODS, HttpMethods, STATUS, STATUS_MESSAGES } from '@/constants';
import { findHandler, addRoute } from '@/router';
import { DB } from './db';
import { UserRepository } from '@/repositories';
import { UserService } from '@/services';
import { UsersController } from '@/controllers';
import { logger } from './utils/logger';

dotenv.config();

const usersRepository = new UserRepository(DB);
const usersService = new UserService(usersRepository);
const usersController = new UsersController(usersService);

export const PORT = process.env.PORT ?? 3000;

const server = http.createServer((req, res) => {
	const { url, method } = req;
	if (!url || !method || !(method in HTTP_METHODS)) {
		res.writeHead(STATUS.BAD_REQUEST, { 'Content-Type': 'text/plain' });
		res.end(STATUS_MESSAGES[STATUS.BAD_REQUEST].badRequest);
	} else {
		try {
			const handler = findHandler({ url, method: method as HttpMethods });
			handler({ req, res });
			logger(`[${method}] ${url} status: ${res.statusCode}`);
		} catch (error) {
			console.error('error: ', error);
			if (error instanceof Error) {
				const [statusCode, message] = error.message.split('||');
				res.writeHead(Number(statusCode), { 'Content-Type': 'text/plain' });
				res.end(message);
				logger(`[${method}] ${url} status: ${statusCode}`);
			}
		}
	}
});

addRoute('GET', 'api/users', usersController.getUsers);
addRoute('GET', `api/users/${DYNAMIC_PATH}`, usersController.getById);
addRoute('POST', `api/users`, usersController.create);
addRoute('PUT', `api/users/${DYNAMIC_PATH}`, usersController.update);

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
