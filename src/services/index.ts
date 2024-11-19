import { User, UserData } from '@/models';
import { UserRepository } from '@/repositories';

export class UserService {
	private readonly usersRepository: UserRepository;

	constructor(usersRepository: UserRepository) {
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

	async update(id: string, user: User) {
		return this.usersRepository.update(id, user);
	}

	async delete(id: string) {
		return this.usersRepository.delete(id);
	}
}
