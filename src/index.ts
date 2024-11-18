import dotenv from 'dotenv';
import * as http from 'node:http';

dotenv.config();

export const PORT = process.env.PORT ?? 3000;

const server = http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/plain' });

	if (req.url === '/' && req.method === 'GET') {
		res.end('Hello, World!');
	} else {
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('Not Found');
	}
});

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
