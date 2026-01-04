# MCP Server Template - Customization Guide

## Setup

1. **Rename project**: Update `name` in `package.json` and `index.ts`
2. **Configure Cursor**: Add MCP server config (see README)

## State Management

### Update Schema

Edit `schema.ts` to match your state structure:

```typescript
export const StateSchema = z.object({
  version: z.string(),
  data: z.object({
    // Your fields here
  }),
});
```

**Important**: Update `schema.ts` first. Never edit `state.yaml` manually - it's managed by the server.

### State Operations

```typescript
import { getState, updateState, saveState } from "./utils/state.ts";
import { type State } from "./schema.ts";

// Read
const state = await getState();

// Partial update (deep merge)
await updateState({ data: { field: "value" } });

// Full replacement
await saveState(newState);
```

## Creating Tools

### Basic Pattern

```typescript
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { log } from "../utils/logger.ts";
import { getState } from "../utils/state.ts";

export const registerMyTool = (server: McpServer) => {
  server.registerTool(
    "my_tool", // snake_case
    {
      description: "Tool description",
      inputSchema: {
        param: z.string().describe("Parameter description"),
      },
    },
    async ({ param }) => {
      const state = await getState();
      const result = `Processed: ${param}`;
      await log("info", "my_tool", { param }, result);
      return {
        content: [{ type: "text", text: result }],
      };
    },
  );
};
```

### Register Tool

In `index.ts`:

```typescript
import { registerMyTool } from "./tools/my-tool.ts";
registerMyTool(server);
```

## Configuration

Paths are configurable via `config.ts` or environment variables:

```typescript
// config.ts
export const config = {
  stateFile: Bun.env.STATE_FILE || "./state.yaml",
  logFile: Bun.env.LOG_FILE || "./changelog.txt",
};
```

## Logging

Always include log level:

```typescript
await log("info", tool, request, response);
await log("error", tool, request, error);
await log("warn", tool, request, warning);
```

## Troubleshooting

- **State validation errors**: Update `schema.ts` to match your state structure
- **Tool not appearing**: Verify registration in `index.ts` and restart Cursor
- **State not persisting**: Check file permissions and ensure `saveState()`/`updateState()` is called

For more details, see the [MCP SDK documentation](https://modelcontextprotocol.io).
