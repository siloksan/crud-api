import os from 'node:os';
import { Cluster, Worker } from 'node:cluster';

export interface WorkerWithPort {
	port: number;
	worker: Worker;
}

export function getWorkers(cluster: Cluster, basePort: number): WorkerWithPort[] {
	return os.cpus().map((_, index) => {
		const port = basePort + index + 1;
		const worker = cluster.fork({ WORKER_PORT: port });
		return {
			worker,
			port,
		};
	});
}
