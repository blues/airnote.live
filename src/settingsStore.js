import { writable } from 'svelte/store';

export const deviceName = writable("");
export const displayValue = writable("");
export const sampleFrequencyUSB = writable("30");
export const sampleFrequencyFull = writable("30");
export const sampleFrequencyLow = writable("720");
export const contactName = writable("");
export const contactEmail = writable("");
export const contactAffiliation = writable("");

