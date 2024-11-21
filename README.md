# CRUD API

## Description

This project implements a simple **CRUD API** with an in-memory database, providing functionality for user management. The API supports creating, reading, updating, and deleting user records while adhering to best practices in API design.

---

## Features

-   **Endpoints**:

    -   `GET /api/users` – Fetch all users.
    -   `GET /api/users/{userId}` – Fetch a user by `id`.
    -   `POST /api/users` – Create a new user.
    -   `PUT /api/users/{userId}` – Update an existing user.
    -   `DELETE /api/users/{userId}` – Delete a user by `id`.

-   **User properties**:

    -   `id` (string, UUID): Auto-generated unique identifier.
    -   `username` (string): Required user name.
    -   `age` (number): Required age of the user.
    -   `hobbies` (array of strings): Required hobbies list (can be empty).

-   **Error Handling**:

    -   Invalid or non-existing endpoints return a `404` response.
    -   Server-side errors return a `500` response.

-   **Horizontal Scaling**:
    -   Uses the Node.js Cluster API for multi-instance application deployment.
    -   Load balancing implemented with a round-robin algorithm.

---

## Technical Requirements

-   **Languages**: JavaScript or TypeScript.
-   **Node.js Version**: `22.9.0` or above.
-   **Allowed Dependencies**:
    -   `nodemon`, `dotenv`, `cross-env`, `typescript`, `ts-node`, `ts-node-dev`
    -   `eslint` and plugins, `prettier`
    -   `webpack-cli`, `webpack` and plugins
    -   `uuid`, `@types/*`, and testing libraries.
-   **Environment Configuration**: Port is defined in `.env`.

---

## Running the Application

### Development Mode

Start the application with hot-reloading:

```bash
npm run start:dev
```

## Production Mode

### Build and run the application:

```bash
npm run start:prod
```

## Multi-instance Mode

Run the application with multiple workers using the Node.js Cluster API:

```bash
npm run start:multi
```

-   Requests are distributed using a round-robin algorithm.
-   Example:

    -   Load balancer listens at localhost:4000.
    -   Workers listen on localhost:4001, localhost:4002, and so on.

## API Documentation

### Endpoints

1. GET /api/users

-   Returns a list of all users.
-   Status Codes:
    -   200: Success.

2. GET /api/users/{userId}

-   Fetches a user by their ID.
-   Status Codes:
    -   200: User found.
    -   400: Invalid userId.
    -   404: User not found.

3. POST /api/users

-   Creates a new user.
-   Request Body:

```json
    Copy code
    {
    "username": "John Doe",
    "age": 30,
    "hobbies": ["reading", "coding"]
    }
```

-   Status Codes:
    -   201: User created.
    -   400: Invalid request body.

4. PUT /api/users/{userId}

-   Updates an existing user.
-   Request Body:

```json
    Copy code
    {
    "username": "John Doe",
    "age": 31,
    "hobbies": ["reading"]
    }
```

-   Status Codes:

    -   200: User updated.
    -   400: Invalid userId or request body.
    -   404: User not found. 5. DELETE /api/users/{userId}

-   Deletes a user by their ID.
-   Status Codes:
    -   204: User deleted.
    -   400: Invalid userId.
    -   404: User not found.

## Tests

### Running Tests

Run tests to verify API functionality:

```bash
npm test
```

### Scenarios Covered

1. Fetch all users (GET /api/users) – Returns an empty array initially.
2. Create a new user (POST /api/users) – Returns the created user.
3. Fetch a user by ID (GET /api/users/{userId}) – Returns the correct user.
4. Update a user (PUT /api/users/{userId}) – Returns the updated user.
5. Delete a user (DELETE /api/users/{userId}) – Successfully removes the user.
6. Verify the deleted user is no longer accessible (GET /api/users/{userId}).

## Horizontal Scaling

### How It Works

-   Load balancer listens at PORT (e.g., 4000).
-   Workers listen on PORT + n (e.g., 4001, 4002, etc.).
-   The load balancer distributes requests evenly across workers:
    -   Request 1 → 4001
    -   Request 2 → 4002
    -   Request 3 → 4003
    -   Request 4 → 4001, and so on.

## Database Consistency

State is shared between workers to ensure consistent data regardless of the worker handling the request.

## Error Handling

-   404 Not Found: For invalid endpoints or non-existing resources.
-   400 Bad Request: For invalid userId or malformed request bodies.
-   500 Internal Server Error: For server-side processing issues.

## Environment Variables

-   PORT: Specifies the port number for the server (default: 4000).

## Tools and Practices

-   Code Quality: Enforced with ESLint and Prettier.
-   Scalability: Achieved via clustering and load balancing.
-   Testing: Automated tests with at least 3 scenarios implemented.
