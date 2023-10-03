// helper function to be able to use CSS variables in JS/TS
const getCssVar = (name: string) => {
  // handle if window is undefined at first (like in SSR)
  if (typeof window === 'undefined') return;
  return getComputedStyle(document.body).getPropertyValue(name);
};

const GOOD = {
  text: 'Good',
  color: getCssVar('--aqiGreen'),
  textColor: getCssVar('--textBlack')
};
const MODERATE = {
  text: 'Moderate',
  color: getCssVar('--aqiYellow'),
  textColor: getCssVar('--textBlack')
};
const UNHEALTHY_SENSITIVE = {
  text: 'Unhealthy for Sensitive Groups',
  color: getCssVar('--aqiOrange'),
  textColor: getCssVar('--textBlack')
};
const UNHEALTHY = {
  text: 'Unhealthy',
  color: getCssVar('--aqiRed'),
  textColor: getCssVar('--textBlack')
};
const VERY_UNHEALTHY = {
  text: 'Very Unhealthy',
  color: getCssVar('--aqiPurple'),
  textColor: getCssVar('--white')
};
const HAZARDOUS = {
  text: 'Hazardous',
  color: getCssVar('--aqiDarkRed'),
  textColor: getCssVar('--white')
};
const NO_DATA = {
  text: 'No Data',
  color: getCssVar('--aqiGrey'),
  textColor: getCssVar('--white')
};
const PM_DATA = {
  text: 'PM Level',
  color: getCssVar('--aqiGrey'),
  textColor: getCssVar('--white')
};

export const aqiColors = [
  getCssVar('--aqiGreen'),
  getCssVar('--aqiYellow'),
  getCssVar('--aqiOrange'),
  getCssVar('--aqiRed'),
  getCssVar('--aqiPurple'),
  getCssVar('--aqiDarkRed')
];

export const aqiRanges = [
  '0 - 50',
  '51 - 100',
  '101 - 150',
  '151 - 200',
  '201 - 300',
  '301 - 500'
];

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
      return getCssVar('--aqiGrey');
    case value <= 50:
      return getCssVar('--aqiGreen');
    case value <= 100:
      return getCssVar('--aqiYellow');
    case value <= 150:
      return getCssVar('--aqiOrange');
    case value <= 200:
      return getCssVar('--aqiRed');
    case value <= 300:
      return getCssVar('--aqiPurple');
    case value <= 301:
      return getCssVar('--aqiDarkRed');
    default:
      return getCssVar('--aqiGrey');
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
      heatIndex =
        heatIndexBase -
        ((13 - h) / 4) * Math.sqrt((17 - Math.abs(t - 95)) / 17);
    } else if (h > 85 && t <= 87) {
      heatIndex = heatIndexBase + ((h - 85) / 10) * ((87 - t) / 5);
    } else {
      heatIndex = heatIndexBase;
    }
  }
  return heatIndex;
}
