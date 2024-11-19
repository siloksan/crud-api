import { IncomingMessage } from 'node:http';

/**
 * Parse the body of an incoming request as JSON.
 *
 * @param req Incoming HTTP request.
 * @returns Promise that resolves to the parsed JSON body or rejects with an error.
 */
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
			} catch (error) {
				reject(new Error('Invalid JSON'));
			}
		});

		req.on('error', (error) => {
			reject(error);
		});
	});
}
