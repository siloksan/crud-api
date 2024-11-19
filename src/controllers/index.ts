import { STATUS, STATUS_MESSAGES } from '@/constants';
import { UserService } from '@/services';
import { ControllerProps } from '@/types';
import { handleError } from '@/utils/handle-error';

export class UsersController {
	private readonly usersService: UserService;

	constructor(usersService: UserService) {
		this.usersService = usersService;
	}

	getUsers = async (args: ControllerProps) => {
		const { res } = args;
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

	// async create() {}
	// async getAll() {}
	// async getById() {}
	// async update() {}
	// async delete() {}
}
