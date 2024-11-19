import dotenv from 'dotenv';
import * as http from 'node:http';
import { HTTP_METHODS, HttpMethods, STATUS } from '@/constants';
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
		res.end(STATUS.BAD_REQUEST);
	} else {
		const handler = findHandler({ url, method: method as HttpMethods });
		try {
			handler({ req, res });
			logger(`[${method}] ${url} status: ${res.statusCode}`);
		} catch (error) {
			res.writeHead(STATUS.INTERNAL_SERVER_ERROR, { 'Content-Type': 'text/plain' });
			res.end(STATUS.INTERNAL_SERVER_ERROR);
		}
	}
});

addRoute('GET', 'api/users', usersController.getUsers);

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
