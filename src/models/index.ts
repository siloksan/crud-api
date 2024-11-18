export interface User {
	id: string;
	name: string;
	age: number;
	hobbies: string[];
}

export type UsersDB = Map<string, User>;
