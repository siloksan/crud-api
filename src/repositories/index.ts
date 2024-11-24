import { v4 as uuidv4 } from 'uuid';
import { UserData, UsersDB } from '@/models';
import { STATUS, STATUS_MESSAGES } from '@/constants';
import { Repository } from '@/types';

export class UserRepository implements Repository<UserData, UserData> {
	private readonly users: UsersDB;
	constructor(db: UsersDB) {
		this.users = db;
	}

	public async getAll() {
		return Array.from(this.users.values());
	}

	public async getById(id: string) {
		if (!this.users.has(id)) {
			throw new Error(`${STATUS.NOT_FOUND}||${STATUS_MESSAGES[STATUS.NOT_FOUND]}`);
		}
		return this.users.get(id);
	}

	public async create(user: UserData) {
		const id = uuidv4();
		const { age, hobbies, name } = user;
		const newUser = { id, name, age, hobbies };

		this.users.set(id, newUser);
		return this.users.get(id);
	}

	public async update(id: string, userData: Partial<UserData>) {
		const user = this.users.get(id);
		if (!user) {
			throw new Error(`${STATUS.NOT_FOUND}||${STATUS_MESSAGES[STATUS.NOT_FOUND]}`);
		}

		const updatedUser = { ...user, ...userData };

		this.users.set(id, updatedUser);
		return this.users.get(id);
	}

	public async delete(id: string) {
		if (!this.users.has(id)) {
			throw new Error(`${STATUS.NOT_FOUND}||${STATUS_MESSAGES[STATUS.NOT_FOUND]}`);
		}

		this.users.delete(id);
		return true;
	}
}
