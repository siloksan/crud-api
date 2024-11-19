export function handleError(err: unknown) {
	if (err instanceof Error) {
		console.error(err.message);
	} else {
		console.error(err);
	}
}
