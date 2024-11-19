import { UserService } from '@/services';

export class UsersController {
	private readonly usersService: UserService;

	constructor(usersService: UserService) {
		this.usersService = usersService;
	}
	getUsers = (req: IncomingMessage, res: ServerResponse) => {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify([{ id: '1', username: 'john', age: 25, hobbies: ['reading'] }]));
	};
	async create() {}
	async getAll() {}
	async getById() {}
	async update() {}
	async delete() {}
}
