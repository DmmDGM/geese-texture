// Imports
import nodeFs from "node:fs";
import nodePath from "node:path";
import { zip } from "zip-a-folder";
import mcmeta from "./mcmeta.json" assert { type: "json" };
import * as access from "./access.js";	
import log from "./log.js";
import { assetsPath, buildPath, rootPath } from "./paths.js";
import { MinecraftMetaData } from "./types.js";

// Executes
try {
	// Builds pack
	await createBuild();
	await compileBuild();
	await zipBuild();
	await removeBuild();
}
catch(error) {
	// Prints error
	log("An error occurred while building! Aborting...", "error");
	console.log(error);

	// Removes existing build directory
	await removeBuild();
}

// Functions
async function createBuild(): Promise<void> {
	// Prints progress
	log("Creating build directory...");

	// Removes previous build directory
	if(await access.accessCheck(buildPath)) {
		log("Build directory already exists!", "warning");
		await removeBuild();
	}

	// Creates new build directory
	await nodeFs.promises.mkdir(buildPath);
}

async function compileBuild(): Promise<void> {
	// Prints progress
	log("Compiling build directory...");

	// Creates mcmetadata
	log("Creating pack.mcmeta...");
	const mcmetaFile = nodePath.resolve(buildPath, "./pack.mcmeta");
	const mcmetaData: MinecraftMetaData = {
		pack: {
			description: mcmeta.description,
			pack_format: mcmeta.format,
		},
		language: {}
	};

	// Compiling languages
	log("Compiling languages...");
	for(let i = 0; i < mcmeta.languages.length; i++) {
		const mcmetaLanguage = mcmeta.languages[i];
		mcmetaData.language[mcmetaLanguage.code] = {
			bidirectional: mcmetaLanguage.bidirectional,
			name: mcmetaLanguage.name,
			region: mcmetaLanguage.region
		};
	}
	await nodeFs.promises.writeFile(mcmetaFile, JSON.stringify(mcmetaData));

	// Creates icon
	const iconSource = nodePath.resolve(assetsPath, "./icon.png");
	if(await access.accessFile(iconSource)) {
		log("Creating pack.png...");
		const iconFile = nodePath.resolve(buildPath, "./pack.png");
		await nodeFs.promises.copyFile(iconSource, iconFile);
	}
	else log("No icon.png found in the assets directory.", "warning");

	// Creates assets
	log("Creating assets directory...");
	for(let i = 0; i < mcmeta.assets.length; i++) {
		const mcmetaAsset = mcmeta.assets[i];
		const mcmetaAssetPath = nodePath.resolve(buildPath, "./assets/", mcmetaAsset);
		const mcmetaAssetSource = nodePath.resolve(assetsPath, mcmetaAsset);
		if(!await access.accessDirectory(mcmetaAssetSource)) {
			log(`Assets for ${mcmetaAsset} not found!`, "warning");
			continue;
		}
		await nodeFs.promises.cp(mcmetaAssetSource, mcmetaAssetPath, {
			recursive: true
		});
	}

	// Creates license
	const licenseSource = nodePath.resolve(rootPath, "./license");
	if(await access.accessFile(licenseSource)) {
		log("Creating license...");
		const licenseFile = nodePath.resolve(buildPath, "./license");
		await nodeFs.promises.copyFile(licenseSource, licenseFile);
	}
	else log("No license found in the root directory.", "warning");

	// Creates readme
	const readmeSource = nodePath.resolve(rootPath, "./README.md");
	if(await access.accessFile(readmeSource)) {
		log("Creating README.md...");
		const readmeFile = nodePath.resolve(buildPath, "./README.md");
		await nodeFs.promises.copyFile(readmeSource, readmeFile);
	}
	else log("No README.md found in the root directory.", "warning");
}

async function zipBuild(): Promise<void> {
	// Prints progress
	log("Zipping build directory...");

	// Checks if build directory exists
	if(!await access.accessCheck(buildPath)) {
		log("Build directory not found!", "warning");
		await createBuild();
	}

	// Zips build directory
	const zipFile = nodePath.resolve(rootPath, "./pack.zip");
	await zip(buildPath, zipFile);
}

async function removeBuild(): Promise<void> {
	// Prints progress
	log("Removing build directory...");
	
	// Removes existing build directory
	await nodeFs.promises.rm(buildPath, { force: true, recursive: true });
}
