import { writable } from 'svelte/store';
import { DEFAULT_SAMPLE_FREQUENCY_MINS } from '$lib/constants';

export const deviceName = writable('');
export const displayValue = writable('');
export const indoorDevice = writable(false);
export const sampleFrequencyUSB = writable('15');
export const sampleFrequencyFull = writable(DEFAULT_SAMPLE_FREQUENCY_MINS);
export const sampleFrequencyLow = writable('720');
export const contactName = writable('');
export const contactEmail = writable('');
export const contactAffiliation = writable('');
export const routingUrl = writable('');
