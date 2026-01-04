import yaml from "js-yaml";
import { config } from "../config.ts";
import { type State, StateSchema } from "../schema.ts";

const STATE_FILE = Bun.file(config.stateFile);

// Deep merge utility function
function deepMerge<T extends Record<string, unknown>>(
	target: T,
	source: Partial<T>,
): T {
	const result = { ...target };
	for (const key in source) {
		if (
			source[key] &&
			typeof source[key] === "object" &&
			!Array.isArray(source[key]) &&
			target[key] &&
			typeof target[key] === "object" &&
			!Array.isArray(target[key])
		) {
			result[key] = deepMerge(
				target[key] as Record<string, unknown>,
				source[key] as Partial<Record<string, unknown>>,
			) as T[Extract<keyof T, string>];
		} else {
			result[key] = source[key] as T[Extract<keyof T, string>];
		}
	}
	return result;
}

export const getState = async (): Promise<State> => {
	const content = await STATE_FILE.text();
	const parsed = yaml.load(content);
	return StateSchema.parse(parsed);
};

export const saveState = async (state: State): Promise<void> => {
	// Validate before writing
	StateSchema.parse(state);
	await Bun.write(STATE_FILE, yaml.dump(state, { indent: 2 }));
};

export const updateState = async (updates: Partial<State>): Promise<State> => {
	const state = await getState();
	const updated = deepMerge(state, updates);
	await saveState(updated);
	return updated;
};
