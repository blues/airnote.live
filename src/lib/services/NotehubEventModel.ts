export interface NotehubEvent {
	body: NotehubEventBody;
	heatIndex: number;
	lat: number;
	location: string;
	lon: number;
	serial_number: string;
	when: string;
}

interface NotehubEventBody {
	captured: string;
	location: string;
	lat: number;
	lon: number;
	serial_number: string;
	aqi: number;
	aqi_algorithm: string;
	aqi_level: string;
	c00_30: number;
	c00_50: number;
	c01_00: number;
	c02_50: number;
	c05_00: number;
	charging?: boolean;
	csamples: number;
	csecs: number;
	device_uid: string;
	humidity: number;
	pm01_0: number;
	pm01_0_rstd: number;
	pm02_5: number;
	pm02_5_rstd: number;
	pm10_0: number;
	pm10_0_rstd: number;
	pressure: number;
	sensor: string;
	temperature: number;
	voltage: number;
}
