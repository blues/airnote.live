export interface AirnoteDevice {
	deviceUID: string;
	productUID: string | (string | null)[];
	pin: string | (string | null)[];
	internalNav?: string | (string | null)[] | null;
}
