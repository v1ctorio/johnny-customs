import { count } from 'console';
import {z} from 'zod';

export const apiSubmissionSchema = z.object({
	user: z.string(),
	item: z.string(),
	submission_date: z.number().optional(),
	country_code: z.string(),
	country: z.string(),
	currency: z.string(),
	declared_value: z.number(),
	declared_value_usd: z.number(),
	paid_customs: z.number(),
	paid_customs_usd: z.number(),
	additional_information: z.string().optional(),
	approved: z.number().optional(),
});

export type apiSubmission = z.infer<typeof apiSubmissionSchema>;