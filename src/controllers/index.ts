import { STATUS, STATUS_MESSAGES } from '@/constants';
import { UserService } from '@/services';
import { ControllerProps } from '@/types';
import { parseBody } from '@/utils/parse-body';
import { isValidUserData, isValidUserProperty } from '@/validators';

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
			if (error instanceof Error) {
				throw new Error(`${STATUS.INTERNAL_SERVER_ERROR}||${STATUS_MESSAGES[STATUS.INTERNAL_SERVER_ERROR]}`);
			}
		}
	};

	getById = async ({ req, res }: ControllerProps) => {
		const url = req?.url;
		const id = url?.split('/').pop();

		if (!id) {
			throw new Error(`${STATUS.BAD_REQUEST}||${STATUS_MESSAGES[STATUS.BAD_REQUEST].invalidId}`);
		}

		try {
			const user = await this.usersService.getById(id);
			if (user) {
				res.writeHead(STATUS.OK, { 'Content-Type': 'application/json, charset=utf-8' });
				res.end(JSON.stringify(user));
			}
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
		}
	};

	create = async ({ req, res }: ControllerProps) => {
		if (!req) {
			throw new Error(`${STATUS.BAD_REQUEST}||${STATUS_MESSAGES[STATUS.BAD_REQUEST].badRequest}`);
		}

		try {
			const user = await parseBody(req);
			if (!isValidUserData(user)) {
				throw new Error(`${STATUS.BAD_REQUEST}||${STATUS_MESSAGES[STATUS.BAD_REQUEST].invalidData}`);
			}

			const createdUser = await this.usersService.create(user);
			res.writeHead(STATUS.CREATED, { 'Content-Type': 'application/json, charset=utf-8' });
			res.end(JSON.stringify(createdUser));
		} catch (error) {
			throw new Error(`${STATUS.BAD_REQUEST}||${STATUS_MESSAGES[STATUS.BAD_REQUEST].invalidData}`);
		}
	};

	async update({ req, res }: ControllerProps) {
		if (!req) {
			throw new Error(`${STATUS.BAD_REQUEST}||${STATUS_MESSAGES[STATUS.BAD_REQUEST].badRequest}`);
		}

		const url = req.url;
		const id = url?.split('/').pop();

		if (!id) {
			throw new Error(`${STATUS.BAD_REQUEST}||${STATUS_MESSAGES[STATUS.BAD_REQUEST].invalidId}`);
		}

		const user = await parseBody(req);
		if (!isValidUserProperty(user)) {
			console.log('user: ', user);
			throw new Error(`${STATUS.BAD_REQUEST}||${STATUS_MESSAGES[STATUS.BAD_REQUEST].invalidData}`);
		}

		const updatedUser = await this.usersService.update(id, user);

		if (user) {
			res.writeHead(STATUS.OK, { 'Content-Type': 'application/json, charset=utf-8' });
			res.end(JSON.stringify(updatedUser));
		}
	}

	// async delete() {}
}
