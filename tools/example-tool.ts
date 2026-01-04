import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { log } from "../utils/logger.ts";
import { getState } from "../utils/state.ts";
// import { updateState, saveState } from "../utils/state.ts"; // Use updateState for partial updates, saveState for full replacement
// Note: State is automatically validated via schema on read/write

/**
 * Example MCP tool registration function.
 *
 * This demonstrates the pattern for creating MCP tools:
 * 1. Define a registration function that takes an McpServer instance
 * 2. Use server.registerTool() with:
 *    - Tool name (string identifier)
 *    - Tool metadata (description, optional inputSchema)
 *    - Async handler function
 *
 * Copy this file and customize it for your own tools.
 */
export const registerExampleTool = (server: McpServer) => {
	server.registerTool(
		"example_tool",
		{
			description: "Example tool demonstrating MCP tool registration pattern.",
			// Optional: Define input schema using Zod for type-safe parameters
			inputSchema: {
				message: z.string().describe("An example message parameter"),
			},
		},
		async ({ message }) => {
			// Access state (read-only)
			const state = await getState();

			// Your tool logic here
			// Example: update state with partial changes
			// const updated = await updateState({ version: "1.0.1" });
			// Or replace entire state:
			// await saveState({ ...state, data: { ...state.data, example_field: message } });

			// Generate response
			const response = `Example tool executed with message: "${message}". State version: ${state.version}`;

			// Log the tool usage (optional but recommended)
			await log("info", "example_tool", { message }, response);

			// Return MCP tool response format
			return {
				content: [
					{
						type: "text",
						text: response,
					},
				],
			};
		},
	);
};
