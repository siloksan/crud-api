import { ACTIONS_TYPES, STATUS, STATUS_MESSAGES } from '@/constants';
import { Message } from '@/types';

export function getErrorMessage(error: unknown) {
	let message: Message;
	if (error instanceof Error) {
		message = {
			type: ACTIONS_TYPES.ERROR,
			data: { message: error.message, stack: error.stack },
		};
		return message;
	} else {
		message = {
			type: ACTIONS_TYPES.ERROR,
			data: { message: STATUS_MESSAGES[STATUS.INTERNAL_SERVER_ERROR] },
		};

		return message;
	}
}
