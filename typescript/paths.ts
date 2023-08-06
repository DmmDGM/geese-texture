// Imports
import nodePath from "node:path";
import nodeUrl from "node:url";

// Constants
const localPath = nodePath.resolve(nodeUrl.fileURLToPath(import.meta.url), "../");
const rootPath = nodePath.resolve(localPath, "../");
const assetsPath = nodePath.resolve(rootPath, "./assets/");
const buildPath = nodePath.resolve(rootPath, "./build/");

// Exports
export {
	localPath,
	rootPath,
	assetsPath,
	buildPath
};