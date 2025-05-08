import { IncomingMessage } from 'node:http';

export async function parseBody(req: IncomingMessage) {
	return new Promise((resolve, reject) => {
		let data = '';

		req.on('data', (chunk) => {
			data += chunk;
		});

		req.on('end', () => {
			try {
				const parsedData = JSON.parse(data);
				resolve(parsedData);
			} catch {
				reject(new Error('Invalid JSON'));
			}
		});

		req.on('error', (error) => {
			reject(error);
		});
	});
}
