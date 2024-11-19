import { User, UsersDB } from '@/models';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_USERS: User[] = [
	{
		id: uuidv4(),
		name: 'John',
		age: 30,
		hobbies: ['music', 'sports'],
	},
	{
		id: uuidv4(),
		name: 'Jane',
		age: 25,
		hobbies: ['programming', 'sports'],
	},
	{
		id: uuidv4(),
		name: 'Bob',
		age: 35,
		hobbies: ['art', 'sports'],
	},
];

export const DB: UsersDB = new Map<string, User>(INITIAL_USERS.map((user) => [user.id, user]));
