// Types
export type MinecraftMetaData = {
	pack: {
		description: string;
		pack_format: number;
	}
	language: { [code: string]: {
		bidirectional: boolean;
		name: string;
		region: string;
	} }
}