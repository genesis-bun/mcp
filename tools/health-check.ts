import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StateSchema } from "../schema.ts";
import { getState } from "../utils/state.ts";

export const registerHealthCheck = (server: McpServer) => {
	server.registerTool(
		"health_check",
		{
			description: "Check server health and state validity",
		},
		async () => {
			try {
				const state = await getState();
				StateSchema.parse(state);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(
								{ status: "healthy", stateValid: true },
								null,
								2,
							),
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(
								{ status: "unhealthy", error: String(error) },
								null,
								2,
							),
						},
					],
				};
			}
		},
	);
};
