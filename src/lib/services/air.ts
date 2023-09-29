const GOOD = { text: 'Good', color: '#00e400', textColor: '#000' };
const MODERATE = { text: 'Moderate', color: '#ffff00', textColor: '#000' };
const UNHEALTHY_SENSITIVE = {
	text: 'Unhealthy for Sensitive Groups',
	color: '#ff7e00',
	textColor: '#000'
};
const UNHEALTHY = { text: 'Unhealthy', color: '#ff0000', textColor: '#000' };
const VERY_UNHEALTHY = {
	text: 'Very Unhealthy',
	color: '#8f3f97',
	textColor: '#fff'
};
const HAZARDOUS = { text: 'Hazardous', color: '#7e0023', textColor: '#fff' };
const NO_DATA = { text: 'No Data', color: '#757575', textColor: '#fff' };
const PM_DATA = { text: 'PM Level', color: '#757575', textColor: '#fff' };

export const aqiColors = ['#00e400', '#ffff00', '#ff7e00', '#ff0000', '#8f3f97', '#7e0023'];

export const aqiRanges = ['0 - 50', '51 - 100', '101 - 150', '151 - 200', '201 - 300', '301 - 500'];

export const aqiTicks = [0, 50, 100, 150, 200, 300, 500];

export const aqiLegend = [
	GOOD,
	MODERATE,
	UNHEALTHY_SENSITIVE,
	UNHEALTHY,
	VERY_UNHEALTHY,
	HAZARDOUS
];

export function getDisplay(type: string, value: number) {
	if (type == 'aqi') {
		return getAQIDisplay(value);
	} else {
		return getPM_Display(value);
	}
}

// Based on https://www.airnow.gov/aqi/aqi-basics/
export function getAQIDisplay(value: number) {
	switch (true) {
		case value === null:
			return NO_DATA;
		case value >= 300:
			return HAZARDOUS;
		case value >= 200:
			return VERY_UNHEALTHY;
		case value >= 150:
			return UNHEALTHY;
		case value >= 100:
			return UNHEALTHY_SENSITIVE;
		case value >= 50:
			return MODERATE;
		case value >= 0:
			return GOOD;
		default:
			return NO_DATA;
	}
}

export function getAQIColor(value: number) {
	switch (true) {
		case value === undefined:
			return '#757575';
		case value <= 50:
			return '#00e400';
		case value <= 100:
			return '#ffff00';
		case value <= 150:
			return '#ff7e00';
		case value <= 200:
			return '#ff0000';
		case value <= 300:
			return '#8f3f97';
		case value <= 301:
			return '#7e0023';
		default:
			return '#757575';
	}
}

export function getPM_Display(value: number) {
	switch (true) {
		case value === undefined:
			return NO_DATA;
		case value !== undefined:
			return PM_DATA;
		default:
			return NO_DATA;
	}
}

export function toFahrenheit(celsius: number) {
	return (9 * celsius) / 5 + 32;
}

export function toCelsius(fahrenheit: number) {
	return (5 * (fahrenheit - 32)) / 9;
}

type inputType = {
	temperature: number;
	humidity: number;
};

// Source: https://github.com/iwanaga/heat-index
// definition http://www.hpc.ncep.noaa.gov/html/heatindex_equation.shtml
// input = {
//     temperature: Number,  required
//     humidity   : Number,  required
// }
export function getHeatIndex(input: inputType) {
	const t = input.temperature || 0;
	const h = input.humidity || 0;

	// Steadman's result
	let heatIndex = 0.5 * (t + 61 + (t - 68) * 1.2 + h * 0.094);

	// regression equation of Rothfusz is appropriate
	if (t >= 80) {
		const heatIndexBase =
			-42.379 +
			2.04901523 * t +
			10.14333127 * h +
			-0.22475541 * t * h +
			-0.00683783 * t * t +
			-0.05481717 * h * h +
			0.00122874 * t * t * h +
			0.00085282 * t * h * h +
			-0.00000199 * t * t * h * h;
		// adjustment
		if (h < 13 && t <= 112) {
			heatIndex = heatIndexBase - ((13 - h) / 4) * Math.sqrt((17 - Math.abs(t - 95)) / 17);
		} else if (h > 85 && t <= 87) {
			heatIndex = heatIndexBase + ((h - 85) / 10) * ((87 - t) / 5);
		} else {
			heatIndex = heatIndexBase;
		}
	}
	return heatIndex;
}
