import * as http from 'node:http';
import { HTTP_METHODS, HttpMethods, STATUS, STATUS_MESSAGES } from '@/constants';
import { findHandler, addRoute } from '@/router';
import { DB } from './db';
import { UserRepository } from '@/repositories';
import { UserService } from '@/services';
import { UsersController } from '@/controllers';
import { ROUTES } from './router/routes';
import { argv } from 'node:process';
import { ClusterUserRepository } from './repositories/cluster-user-repository';

const isWorker = argv.includes('--worker');
const usersRepository = isWorker ? new ClusterUserRepository() : new UserRepository(DB);
const usersService = new UserService(usersRepository);
const usersController = new UsersController(usersService);

export const server = http.createServer(async (req, res) => {
	const { url, method } = req;

	if (!url || !method || !(method in HTTP_METHODS)) {
		res.writeHead(STATUS.BAD_REQUEST, { 'Content-Type': 'text/plain' });
		res.end(STATUS_MESSAGES[STATUS.BAD_REQUEST].badRequest);
	} else {
		try {
			const handler = findHandler({ url, method: method as HttpMethods });
			await handler({ req, res });
			console.log(`[${method}] ${url} status: ${res.statusCode}`);
		} catch (error) {
			if (error instanceof Error) {
				const [statusCode, message] = error.message.split('||');
				const status = Number.isNaN(Number(statusCode)) ? STATUS.INTERNAL_SERVER_ERROR : Number(statusCode);
				res.writeHead(Number(status), { 'Content-Type': 'application/json' });

				const messageBody =
					status === STATUS.INTERNAL_SERVER_ERROR ? STATUS_MESSAGES[STATUS.INTERNAL_SERVER_ERROR] : message;

				res.end(JSON.stringify({ message: messageBody }));
				console.log(`[${method}]${url} status: ${statusCode}`);
			}
		}
	}
});

addRoute(HTTP_METHODS.GET, ROUTES.API.USERS.ROUTE, usersController.getUsers);
addRoute(HTTP_METHODS.GET, ROUTES.API.USERS.ID, usersController.getById);
addRoute(HTTP_METHODS.POST, ROUTES.API.USERS.ROUTE, usersController.create);
addRoute(HTTP_METHODS.PUT, ROUTES.API.USERS.ID, usersController.update);
addRoute(HTTP_METHODS.DELETE, ROUTES.API.USERS.ID, usersController.delete);

export function startServer(port: number) {
	server.listen(port, () => {
		console.log(`Server is running on http://localhost:${port}`);
	});
}
