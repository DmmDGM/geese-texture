// Imports
import chalk from "chalk";

// Functions
function log(message: string, level: "default" | "warning" | "error" = "default"): void {
	// Creates date
	const date = new Date();
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	const seconds = date.getSeconds().toString().padStart(2, "0");
	const milliseconds = date.getMilliseconds().toString().padStart(3, "0");
	const time = `${hours}:${minutes}:${seconds}.${milliseconds}`;

	// Formats message
	const colors = {
		default: chalk.green,
		warning: chalk.yellow,
		error: chalk.red
	};
	const entry = `${chalk.cyan(time)} | ${colors[level](message)}`;
	
	// Prints message
	console.log(entry);
}

// Exports
export default log;
