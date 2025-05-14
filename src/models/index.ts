export interface UserData {
	username: string;
	age: number;
	hobbies: string[];
}

export interface User extends UserData {
	id: string;
}

export type UsersDB = Map<string, User>;
