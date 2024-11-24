import { User, UserData } from '@/models';
import { Repository } from '@/types';

export class UserService {
	private readonly usersRepository: Repository<User, UserData>;

	constructor(usersRepository: Repository<User, UserData>) {
		this.usersRepository = usersRepository;
	}

	async getAll() {
		return this.usersRepository.getAll();
	}

	async getById(id: string) {
		return this.usersRepository.getById(id);
	}

	async create(user: UserData) {
		return this.usersRepository.create(user);
	}

	async update(id: string, user: Partial<UserData>) {
		return this.usersRepository.update(id, user);
	}

	async delete(id: string) {
		return this.usersRepository.delete(id);
	}
}
