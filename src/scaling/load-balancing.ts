import { STATUS, STATUS_MESSAGES } from '@/constants';
import { Cluster } from 'node:cluster';
import * as http from 'node:http';
import { WorkerWithPort } from './workers';

export class LoadBalancer {
	private currentWorker = 0;
	constructor(
		private readonly cluster: Cluster,
		private readonly workers: WorkerWithPort[],
		private readonly port: number
	) {}

	public start() {
		const server = http.createServer((req, res) => {
			const worker = this.workers[this.currentWorker];
			this.currentWorker = (this.currentWorker + 1) % this.workers.length;

			if (!worker) {
				res.writeHead(STATUS.SERVICE_UNAVAILABLE);
				res.end(STATUS_MESSAGES[STATUS.SERVICE_UNAVAILABLE]);
				return;
			}
			const options = {
				hostname: 'localhost',
				port: worker.port,
				path: req.url,
				method: req.method,
				headers: req.headers,
			};

			const proxy = http.request(options, (workerRes) => {
				res.writeHead(workerRes.statusCode ?? STATUS.INTERNAL_SERVER_ERROR, workerRes.headers);
				workerRes.pipe(res, { end: true });
			});

			req.pipe(proxy, { end: true });

			proxy.on('error', (err) => {
				console.error('Error in proxy:', err);
				res.writeHead(STATUS.INTERNAL_SERVER_ERROR);
				res.end(STATUS_MESSAGES[STATUS.INTERNAL_SERVER_ERROR]);
			});
		});

		server.listen(this.port, () => {
			console.log(`Load balancer running on http://localhost:${this.port}`);
		});
	}

	public handleWorkerCrash = () => {
		this.cluster.on('exit', (worker, code, signal) => {
			if (code !== 0 && !worker.exitedAfterDisconnect) {
				console.error(
					`Worker ${worker.process.pid} crashed  with exit code ${code} and signal ${signal}. Restarting...`
				);

				const index = this.workers.findIndex((w) => w.worker === worker);

				if (index !== -1) {
					const crashedWorker = this.workers[index] as WorkerWithPort;
					const port = crashedWorker.port;
					const newWorker = this.cluster.fork({ PORT: port });
					this.workers[index] = { worker: newWorker, port };
				}
			}
		});
	};
}
