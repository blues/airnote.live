import { writable } from 'svelte/store';

export const deviceName = writable("");
export const displayValue = writable("pm2.5");
export const airSampleSecs = writable("60");
export const contactName = writable("");
export const contactEmail = writable("");
export const contactAffiliation = writable("");
