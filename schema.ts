import { z } from "zod";

export const StateSchema = z.object({
	version: z.string(),
	data: z.object({
		example_field: z.string(),
		// Add more fields as needed - customize this structure to match your application
	}),
});

export type State = z.infer<typeof StateSchema>;
