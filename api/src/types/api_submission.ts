import {z} from 'zod';

export interface apiSubmission {
	user: string;
	item: string;
	submission_date: number;
	declared_value: number;
	paid_customs: number;
	country_code: string;
	additional_information?: string;
}

export const apiSubmissionSchema = z.object({
	user: z.string(),
	item: z.string(),
	submission_date: z.number(),
	declared_value: z.number(),
	paid_customs: z.number(),
	country_code: z.string(),
	additional_information: z.string().optional(),
});