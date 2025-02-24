import {z} from 'zod';

export const apiSubmissionSchema = z.object({
	user: z.string(),
	item: z.string(),
	submission_date: z.number(),
	declared_value: z.number(),
	declared_value_usd: z.number(),
	paid_customs: z.number(),
	paid_customs_usd: z.number(),
	country_code: z.string(),
	currency: z.string(),
	additional_information: z.string().optional(),
});

export type apiSubmission = z.infer<typeof apiSubmissionSchema>;