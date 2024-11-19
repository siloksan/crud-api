import { STATUS, STATUS_MESSAGES } from '@/constants';
import { UserService } from '@/services';
import { ControllerProps } from '@/types';
import { handleError } from '@/utils/handle-error';
import { parseBody } from '@/utils/parse-body';
import { isValidUserData } from '@/validators';

export class UsersController {
	private readonly usersService: UserService;

	constructor(usersService: UserService) {
		this.usersService = usersService;
	}

	getUsers = async ({ res }: ControllerProps) => {
		try {
			const users = await this.usersService.getAll();
			res.writeHead(STATUS.OK, { 'Content-Type': 'application/json, charset=utf-8' });
			res.end(JSON.stringify(users));
		} catch (error) {
			res.writeHead(STATUS.INTERNAL_SERVER_ERROR, { 'Content-Type': 'text/plain' });
			res.end(STATUS_MESSAGES[STATUS.INTERNAL_SERVER_ERROR]);
			handleError(error);
		}
	};

	getById = async ({ req, res }: ControllerProps) => {
		const url = req?.url;
		const id = url?.split('/').pop();
		if (!id) {
			res.writeHead(STATUS.BAD_REQUEST, { 'Content-Type': 'text/plain' });
			res.end(STATUS_MESSAGES[STATUS.BAD_REQUEST].invalidId);
			return;
		}
		try {
			const user = await this.usersService.getById(id);
			if (!user) {
				res.writeHead(STATUS.NOT_FOUND, { 'Content-Type': 'text/plain' });
				res.end(STATUS_MESSAGES[STATUS.NOT_FOUND]);
				return;
			}
			res.writeHead(STATUS.OK, { 'Content-Type': 'application/json, charset=utf-8' });
			res.end(JSON.stringify(user));
		} catch (error) {
			res.writeHead(STATUS.INTERNAL_SERVER_ERROR, { 'Content-Type': 'text/plain' });
			res.end(STATUS_MESSAGES[STATUS.INTERNAL_SERVER_ERROR]);
			handleError(error);
		}
	};

	create = async ({ req, res }: ControllerProps) => {
		if (!req) {
			res.writeHead(STATUS.BAD_REQUEST, { 'Content-Type': 'text/plain' });
			res.end(STATUS_MESSAGES[STATUS.BAD_REQUEST].badRequest);
			return;
		}

		try {
			const user = await parseBody(req);
			if (!isValidUserData(user)) {
				res.writeHead(STATUS.BAD_REQUEST, { 'Content-Type': 'text/plain' });
				res.end(STATUS_MESSAGES[STATUS.BAD_REQUEST].invalidData);
				return;
			}

			const createdUser = await this.usersService.create(user);
			res.writeHead(STATUS.CREATED, { 'Content-Type': 'application/json, charset=utf-8' });
			res.end(JSON.stringify(createdUser));
		} catch (error) {
			res.writeHead(STATUS.BAD_REQUEST, { 'Content-Type': 'text/plain' });
			res.end(STATUS_MESSAGES[STATUS.BAD_REQUEST].invalidData);
		}
	};
	// async getAll() {}
	// async update() {}
	// async delete() {}
}
