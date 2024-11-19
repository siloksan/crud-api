import { User, UsersDB } from '@/models';

export class UserRepository {
	private readonly users: UsersDB;
	constructor(db: UsersDB) {
		this.users = db;
	}

	public async getAll() {
		return Array.from(this.users.values());
	}

	public async getById(id: string) {
		return this.users.get(id);
	}

	public async create(user: User) {
		this.users.set(user.id, user);
		return user;
	}

	public async update(id: string, user: User) {
		this.users.set(id, user);
		return user;
	}

	public async delete(id: string) {
		this.users.delete(id);
	}
}
