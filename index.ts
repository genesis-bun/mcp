import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Import your tool registration functions here
// Example: import { registerExampleTool } from "./tools/example-tool.ts";
import { registerHealthCheck } from "./tools/health-check.ts";

const server = new McpServer({
	name: "mcp-server",
	version: "1.0.0",
});

// Register your MCP tools here
// Example: registerExampleTool(server);
registerHealthCheck(server);

const transport = new StdioServerTransport();
await server.connect(transport);
console.log("MCP Server initialized\n");
