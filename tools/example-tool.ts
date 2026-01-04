import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { log } from "../utils/logger.ts";
import { getState } from "../utils/state.ts";

export const registerExampleTool = (server: McpServer) => {
	server.registerTool(
		"example_tool",
		{
			description: "Example tool demonstrating MCP tool registration pattern.",
			inputSchema: {
				message: z.string().describe("An example message parameter"),
			},
		},
		async ({ message }) => {
			const state = await getState();
			const response = `Example tool executed with message: "${message}". State version: ${state.version}`;
			await log("info", "example_tool", { message }, response);
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
