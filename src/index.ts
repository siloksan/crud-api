import { MyRepository } from '@/repositories';
import * as http from 'node:http';
export const PORT = 3000;

console.log('MyRepository: ', MyRepository);
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
