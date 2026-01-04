# MCP Server Template

A headless template for building custom Model Context Protocol (MCP) servers with Bun and TypeScript. This template provides a clean foundation with state management, type generation, and tool registration patterns.

## Quick Start

### Install

```bash
bun install
```

### Run

```bash
bun run dev    # Development with hot reload
bun run start  # Production
```

### Configure in Cursor

Add to Cursor's MCP settings:

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

Restart Cursor. Your tools are now available.

## Project Structure

```
├── index.ts              # MCP server entry point
├── state.yaml           # State file (customize for your needs)
├── types.ts             # Auto-generated types (do not edit manually)
├── tools/               # MCP tool handlers
│   └── example-tool.ts  # Example tool implementation
├── utils/               # Utilities
│   ├── logger.ts        # Changelog logger
│   └── state.ts         # State management
└── scripts/
    └── generate-types.ts # Type generation from YAML
```

## Features

- **Auto-generated types** - Types from `state.yaml` via quicktype
- **State persistence** - YAML-based state management
- **Activity logging** - Changelog tracks all tool usage
- **Modular architecture** - Clean separation of concerns
- **Type-safe tools** - Zod schemas for input validation

## Getting Started

### 1. Customize Your Project

**Rename the project:**
- Update `name` in `package.json`
- Update server `name` in `index.ts`
- Update MCP server configuration in Cursor

**Customize state structure:**
- Edit `state.yaml` to match your application's needs
- Run `bun run generate-types` to regenerate TypeScript types
- Types will be available in `types.ts` (auto-generated, don't edit manually)

### 2. Add Your First Tool

1. Copy `tools/example-tool.ts` to create your new tool
2. Customize the tool name, description, and logic
3. Register it in `index.ts`:
   ```typescript
   import { registerYourTool } from "./tools/your-tool.ts";
   // ...
   registerYourTool(server);
   ```

See `tools/example-tool.ts` for a complete example with comments.

### 3. Customize State Structure

Edit `state.yaml` to define your application's state:

```yaml
version: "1.0.0"
data:
  user_preferences:
    theme: "dark"
  counters:
    total_actions: 0
```

Then regenerate types:
```bash
bun run generate-types
```

Access state in your tools:
```typescript
import { getState, saveState, updateState } from "../utils/state.ts";

// Read state
const state = await getState();

// Update state partially (merges with existing state)
const updated = await updateState({ version: "1.0.1" });

// Replace entire state
await saveState({ ...state, data: { ...state.data, newField: "value" } });
```

## Architecture

### MCP Server Flow

```
Cursor IDE
    ↓ (stdio transport)
index.ts (MCP server)
    ↓ (tool registration)
tools/*.ts (tool handlers)
    ↓ (state access)
utils/state.ts → state.yaml
    ↓ (logging)
utils/logger.ts → changelog.txt
```

### Tool Registration Pattern

Each tool follows this pattern:

1. **Registration function** - Exports a function that takes `McpServer`
2. **Tool metadata** - Name, description, optional Zod input schema
3. **Handler function** - Async function that processes requests
4. **State access** - Read/write state via `getState()` / `saveState()`
5. **Logging** - Optional logging via `log()` utility
6. **Response format** - Returns MCP-compatible response structure

### Type Generation Workflow

1. Edit `state.yaml` with your desired structure
2. Run `bun run generate-types`
3. Types are generated in `types.ts`
4. Import and use types in your tools:
   ```typescript
   import type { State } from "../types.ts";
   ```

Types auto-generate before `start`/`dev` via pre-build hooks.

## Development

### Adding New Tools

1. Create a new file in `tools/` directory
2. Follow the pattern in `tools/example-tool.ts`
3. Register the tool in `index.ts`
4. Test with `bun run dev`

### State Management

- State is persisted in `state.yaml` (YAML format)
- Use `getState()` to read state
- Use `updateState()` for partial updates (merges with existing state)
- Use `saveState()` to replace entire state
- State is type-safe via auto-generated types
- Basic error handling for missing files and invalid YAML

### Logging

All tool usage is automatically logged to `changelog.txt`:
- Timestamp
- Tool name
- Request parameters
- Response text

### Type Generation

Types are automatically generated from `state.yaml`:
- Run manually: `bun run generate-types`
- Auto-runs before `start`/`dev` commands
- Types are written to `types.ts` (do not edit manually)

## Customization Guide

For detailed customization instructions, see [TEMPLATE.md](./TEMPLATE.md).

## License

Private template - customize as needed.
