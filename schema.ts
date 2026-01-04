import { z } from "zod";

export const StateSchema = z.object({
	version: z.string(),
	data: z.object({
		example_field: z.string(),
	}),
});

export type State = z.infer<typeof StateSchema>;
