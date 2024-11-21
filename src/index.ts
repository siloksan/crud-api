import dotenv from 'dotenv';
import * as http from 'node:http';
import { HTTP_METHODS, HttpMethods, STATUS, STATUS_MESSAGES } from '@/constants';
import { findHandler, addRoute } from '@/router';
import { DB } from './db';
import { UserRepository } from '@/repositories';
import { UserService } from '@/services';
import { UsersController } from '@/controllers';
import { logger } from './utils/logger';
import { ROUTES } from './router/routes';

dotenv.config();

const usersRepository = new UserRepository(DB);
const usersService = new UserService(usersRepository);
const usersController = new UsersController(usersService);

export const PORT = process.env.PORT ?? 3000;

export const server = http.createServer(async (req, res) => {
	const { url, method } = req;
	if (!url || !method || !(method in HTTP_METHODS)) {
		res.writeHead(STATUS.BAD_REQUEST, { 'Content-Type': 'text/plain' });
		res.end(STATUS_MESSAGES[STATUS.BAD_REQUEST].badRequest);
	} else {
		try {
			const handler = findHandler({ url, method: method as HttpMethods });
			await handler({ req, res });
			logger(`[${method}] ${url} status: ${res.statusCode}`);
		} catch (error) {
			if (error instanceof Error) {
				const [statusCode, message] = error.message.split('||');
				const status = Number.isNaN(Number(statusCode)) ? STATUS.INTERNAL_SERVER_ERROR : Number(statusCode);
				res.writeHead(Number(status), { 'Content-Type': 'text/plain' });
				res.end(
					status === STATUS.INTERNAL_SERVER_ERROR ? STATUS_MESSAGES[STATUS.INTERNAL_SERVER_ERROR] : message
				);
				logger(`[${method}] ${url} status: ${statusCode}`);
			}
		}
	}
});

addRoute('GET', ROUTES.API.USERS.ROUTE, usersController.getUsers);
addRoute('GET', ROUTES.API.USERS.ID, usersController.getById);
addRoute('POST', ROUTES.API.USERS.ROUTE, usersController.create);
addRoute('PUT', ROUTES.API.USERS.ID, usersController.update);
addRoute('DELETE', ROUTES.API.USERS.ID, usersController.delete);

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
