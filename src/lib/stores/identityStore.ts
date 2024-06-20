import { writable } from 'svelte/store';
import type { KratosIdentity } from '$lib/ory/types';

export const identity = writable<KratosIdentity | null>(null);
