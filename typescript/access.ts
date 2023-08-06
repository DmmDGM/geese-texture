// Imports
import nodeFs from "node:fs";

// Functions
async function accessCheck(path: string): Promise<boolean> {
	try {
		await nodeFs.promises.access(path, nodeFs.constants.F_OK);
		return true;
	}
	catch {
		return false;
	}
}

async function accessDirectory(path: string): Promise<boolean> {
	return await accessCheck(path) && (await nodeFs.promises.lstat(path)).isDirectory();
}

async function accessFile(path: string): Promise<boolean> {
	return await accessCheck(path) && (await nodeFs.promises.lstat(path)).isFile();
}

// Exports
export {
	accessCheck,
	accessDirectory,
	accessFile
};