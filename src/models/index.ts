export interface UserData {
	name: string;
	age: number;
	hobbies: string[];
}

export interface User extends UserData {
	id: string;
}

export type UsersDB = Map<string, User>;
