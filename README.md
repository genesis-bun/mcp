# MCP Server Template

Minimal template for building Model Context Protocol (MCP) servers with Bun and TypeScript.

## Quick Start

```bash
bun install
bun run dev    # Development
bun run start  # Production
```

### Configure in Cursor

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "bun",
      "args": ["/path/to/your/project/index.ts"],
      "cwd": "/path/to/your/project"
    }
  }
}
```

## Project Structure

```
├── index.ts          # Server entry point
├── schema.ts         # State schema (Zod)
├── config.ts         # Configuration
├── state.yaml        # State file
├── tools/            # Tool handlers
└── utils/            # State & logging utilities
```

## Features

- Schema-based state validation (Zod)
- YAML state persistence
- Tool usage logging
- Deep merge for state updates

## Usage

### Customize State

1. Update `schema.ts` to match your state structure
2. State is automatically validated on read/write

### Add Tools

1. Create `tools/your-tool.ts` following `example-tool.ts` pattern
2. Register in `index.ts`: `registerYourTool(server);`

### State Operations

```typescript
import { getState, updateState, saveState } from "./utils/state.ts";
import { type State } from "./schema.ts";

const state = await getState();
await updateState({ version: "1.0.1" }); // Deep merge
await saveState(newState); // Full replacement
```

### Logging

```typescript
import { log } from "./utils/logger.ts";
await log("info", "tool_name", request, response);
```

See [TEMPLATE.md](./TEMPLATE.md) for detailed examples.
