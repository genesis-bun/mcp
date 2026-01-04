export const config = {
	stateFile: Bun.env.STATE_FILE || "./state.yaml",
	logFile: Bun.env.LOG_FILE || "./changelog.txt",
};
