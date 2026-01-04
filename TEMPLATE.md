# MCP Server Template - Customization Guide

This guide walks you through customizing this template to build your own MCP server.

## Step 1: Rename Your Project

### Update package.json

Change the `name` field in `package.json`:

```json
{
  "name": "your-mcp-server-name"
}
```

### Update Server Name

Edit `index.ts` and change the server name:

```typescript
const server = new McpServer({
  name: "your-mcp-server-name",
  version: "1.0.0",
});
```

### Update Cursor Configuration

Update your Cursor MCP settings with the correct paths:

```json
{
  "mcpServers": {
    "your-mcp-server-name": {
      "command": "bun",
      "args": ["/absolute/path/to/your/project/index.ts"],
      "cwd": "/absolute/path/to/your/project"
    }
  }
}
```

## Step 2: Customize State Structure

### Edit state.yaml

Define your application's state structure in `state.yaml`:

```yaml
version: "1.0.0"
data:
  # Add your custom state fields here
  user_settings:
    theme: "dark"
    language: "en"
  counters:
    total_actions: 0
  # Add more fields as needed
```

### Regenerate Types

After modifying `state.yaml`, regenerate TypeScript types:

```bash
bun run generate-types
```

This creates/updates `types.ts` with type-safe interfaces matching your state structure.

### Use State in Tools

Access state in your tools:

```typescript
import { getState, saveState, updateState } from "../utils/state.ts";
import type { State } from "../types.ts";

// Read state
const state = await getState();

// Update state partially (merges with existing state)
const updated = await updateState({ version: "1.0.1" });

// Or update nested data
const updated2 = await updateState({
  data: { ...state.data, counters: { total_actions: state.data.counters.total_actions + 1 } }
});

// Replace entire state (use when you need full control)
await saveState({ ...state, data: { ...state.data, newField: "value" } });
```

## Step 3: Create Your First Tool

### Copy the Example

Start with `tools/example-tool.ts` as a template:

```bash
cp tools/example-tool.ts tools/my-tool.ts
```

### Customize the Tool

Edit your new tool file:

```typescript
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { log } from "../utils/logger.ts";
import { getState, updateState } from "../utils/state.ts";

export const registerMyTool = (server: McpServer) => {
  server.registerTool(
    "my_tool",  // Tool identifier (snake_case)
    {
      description: "What your tool does.",
      // Optional: Define input parameters with Zod
      inputSchema: {
        param1: z.string().describe("Description of param1"),
        param2: z.number().optional().describe("Optional number parameter"),
      },
    },
    async ({ param1, param2 }) => {
      // Your tool logic here
      const state = await getState();
      
      // Process the request
      const result = `Processed: ${param1}`;
      
      // Optionally update state (partial update)
      // const updated = await updateState({ version: "1.0.1" });
      
      // Log the usage (recommended)
      await log("my_tool", { param1, param2 }, result);
      
      // Return MCP response format
      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    },
  );
};
```

### Register the Tool

Add your tool registration to `index.ts`:

```typescript
import { registerMyTool } from "./tools/my-tool.ts";

// ... server setup ...

registerMyTool(server);
```

## Step 4: Tool Patterns

### Tool Without Parameters

```typescript
server.registerTool(
  "simple_tool",
  {
    description: "A tool that takes no parameters.",
  },
  async () => {
    const state = await getState();
    return {
      content: [{ type: "text", text: "Simple response" }],
    };
  },
);
```

### Tool With Required Parameters

```typescript
server.registerTool(
  "required_params_tool",
  {
    description: "Tool with required parameters.",
    inputSchema: {
      name: z.string().describe("User's name"),
      age: z.number().describe("User's age"),
    },
  },
  async ({ name, age }) => {
    return {
      content: [{ type: "text", text: `${name} is ${age} years old` }],
    };
  },
);
```

### Tool With Optional Parameters

```typescript
server.registerTool(
  "optional_params_tool",
  {
    description: "Tool with optional parameters.",
    inputSchema: {
      required: z.string().describe("Required field"),
      optional: z.string().optional().describe("Optional field"),
    },
  },
  async ({ required, optional }) => {
    const text = optional 
      ? `${required} with ${optional}` 
      : required;
    return {
      content: [{ type: "text", text }],
    };
  },
);
```

### Tool That Modifies State

```typescript
server.registerTool(
  "increment_counter",
  {
    description: "Increments a counter in state.",
    inputSchema: {
      amount: z.number().default(1).describe("Amount to increment"),
    },
  },
  async ({ amount }) => {
    const state = await getState();
    const updated = await updateState({
      data: {
        ...state.data,
        counters: {
          ...state.data.counters,
          total_actions: state.data.counters.total_actions + amount,
        },
      },
    });
    
    return {
      content: [{
        type: "text",
        text: `Counter incremented by ${amount}. New total: ${updated.data.counters.total_actions}`,
      }],
    };
  },
);
```

## Step 5: Customize Cursor Rules (Optional)

### Create Custom Rules

Create `.cursor/rules/your-rules.mdc`:

```markdown
---
description: Your custom MCP server rules
globs: state.yaml, index.ts, tools/**/*.ts
---

# Your MCP Server Rules

## Tool Usage Guidelines
- Use `my_tool` when the user asks about X
- Use `another_tool` when the user mentions Y

## Response Style
- Keep responses concise
- Use friendly tone
```

### Document Tool Behavior

Add rules that guide when tools should be used automatically:

```markdown
## Automatic Tool Usage
- When user asks "how am I doing?", use `get_status` tool
- When user mentions completing a task, use `log_task` tool
```

## Step 6: Testing Your Server

### Development Mode

Run with hot reload:

```bash
bun run dev
```

### Test Tool Registration

Check that your server starts without errors. The console should show:

```
MCP Server initialized
```

### Test in Cursor

1. Restart Cursor after configuring MCP settings
2. Open a chat in Cursor
3. Try invoking your tools by name or description
4. Check `changelog.txt` to see tool usage logs

## Step 7: Advanced Customization

### Custom Logging

Modify `utils/logger.ts` to customize log format or destination:

```typescript
export const log = async (tool: string, req: unknown, res: string) => {
  // Custom logging logic
  const timestamp = new Date().toISOString();
  // Write to custom location or format
};
```

### Multiple State Files

Extend `utils/state.ts` to support multiple state files:

```typescript
export const getState = async (file: string = "state.yaml"): Promise<State> => {
  const stateFile = Bun.file(`${import.meta.dir}/../${file}`);
  const content = await stateFile.text();
  return yaml.load(content) as State;
};
```

### Environment Variables

Use environment variables for configuration:

```typescript
const STATE_FILE_PATH = process.env.STATE_FILE_PATH || "./state.yaml";
```

## Troubleshooting

### Types Not Updating

If types don't match your `state.yaml`:
1. Ensure `state.yaml` is valid YAML
2. Run `bun run generate-types` manually
3. Check `types.ts` for generated types

### Tool Not Appearing in Cursor

1. Verify MCP configuration in Cursor settings
2. Restart Cursor completely
3. Check server logs for errors
4. Verify tool is registered in `index.ts`

### State Not Persisting

1. Check file permissions on `state.yaml`
2. Verify `saveState()` or `updateState()` is being called
3. Check for YAML serialization errors
4. Ensure `state.yaml` exists (error will be thrown if missing)

### State File Errors

The state utilities include basic error handling:
- Missing file: Error thrown with message "State file (state.yaml) not found"
- Empty file: Error thrown with message "State file (state.yaml) is empty"
- Invalid YAML: Error thrown with parsing details

Handle errors in your tools:
```typescript
try {
  const state = await getState();
} catch (error) {
  // Handle error appropriately
  console.error("Failed to load state:", error);
}
```

## Next Steps

- Add more tools following the patterns above
- Customize state structure for your use case
- Add error handling and validation
- Implement tool dependencies or workflows
- Add tests for your tools

For more information, see the [MCP SDK documentation](https://modelcontextprotocol.io).

