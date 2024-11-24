import request from 'supertest';
import { server } from './server';
import { User, UsersDB } from './models';
import { addRoute } from './router';
import { UserRepository } from './repositories';
import { UserService } from './services';
import { UsersController } from './controllers';
import { ROUTES } from './router/routes';
import { STATUS } from './constants';

const DUMMY_DB: UsersDB = new Map<string, User>([]);
const newUser = { name: 'John Doe', age: 38, hobbies: ['music', 'sports'] };

const usersRepository = new UserRepository(DUMMY_DB);
const usersService = new UserService(usersRepository);
const usersController = new UsersController(usersService);

jest.spyOn(console, 'log').mockImplementation(() => {});

addRoute('GET', ROUTES.API.USERS.ROUTE, usersController.getUsers);
addRoute('GET', ROUTES.API.USERS.ID, usersController.getById);
addRoute('POST', ROUTES.API.USERS.ROUTE, usersController.create);
addRoute('PUT', ROUTES.API.USERS.ID, usersController.update);
addRoute('DELETE', ROUTES.API.USERS.ID, usersController.delete);

describe('User API Tests', () => {
	afterAll(() => {
		server.close();
	});

	afterEach(() => {
		DUMMY_DB.clear();
	});

	test('Should get all records with a GET api/users request (an empty array is expected)', async () => {
		const response = await request(server).get('/api/users');

		expect(response.status).toBe(STATUS.OK);
		expect(response.body).toEqual([]);
	});

	test('Should create a new user with a POST api/users', async () => {
		const response = await request(server).post('/api/users').send(newUser).set('Content-Type', 'application/json');
		const createdUser = response.body;
		const { id, ...userData } = createdUser;

		expect(response.status).toBe(STATUS.CREATED);
		expect(typeof id).toBe('string');
		expect(userData).toMatchObject(newUser);
	});

	test('should get the created user with a GET api/users/:id', async () => {
		const response = await request(server).post('/api/users').send(newUser).set('Content-Type', 'application/json');
		const createdUser = response.body;
		const { id } = createdUser;

		const getResponse = await request(server).get(`/api/users/${id}`);
		expect(getResponse.status).toBe(STATUS.OK);
		expect(getResponse.body).toMatchObject(createdUser);
	});

	test('should update an existing user with a PUT api/users/:id ', async () => {
		const response = await request(server).post('/api/users').send(newUser).set('Content-Type', 'application/json');
		const createdUser = response.body;
		const { id } = createdUser;

		const newData = { ...newUser, ...{ name: 'Jane Doe' } };
		const updatedUser = await request(server)
			.put(`/api/users/${id}`)
			.send(newData)
			.set('Content-Type', 'application/json');

		expect(updatedUser.status).toBe(STATUS.OK);
		expect(updatedUser.body).toMatchObject({ id, ...newData });
	});

	test('should delete an existing user with a DELETE api/users/:id', async () => {
		const response = await request(server).post('/api/users').send(newUser).set('Content-Type', 'application/json');
		const createdUser = response.body;
		const { id } = createdUser;

		const deleteResponse = await request(server).delete(`/api/users/${id}`);
		expect(deleteResponse.status).toBe(204);

		const getResponse = await request(server).get(`/api/users/${id}`);
		expect(getResponse.status).toBe(404);
	});
});
