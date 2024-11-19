import { v4 as uuidv4 } from 'uuid';
import { User, UserData, UsersDB } from '@/models';

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

	public async create(user: UserData) {
		const id = uuidv4();
		const newUser = { ...user, id };

		this.users.set(id, newUser);
		return this.users.get(id);
	}

	public async update(id: string, user: User) {
		this.users.set(id, user);
		return user;
	}

	public async delete(id: string) {
		this.users.delete(id);
	}
}
