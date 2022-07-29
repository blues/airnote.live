const GOOD = { text: "Good", color: "#8FD2AD" };
const MODERATE = { text: "Moderate", color: "#F8E890" };
const UNHEALTHY_SENSITIVE = {
  text: "Unhealthy for Sensitive Groups",
  color: "#FEBB68",
};
const UNHEALTHY = { text: "Unhealthy", color: "#D76E81" };
const VERY_UNHEALTHY = { text: "Very Unhealthy", color: "#9467D2" };
const HAZARDOUS = { text: "Hazardous", color: "#7E4B4B" };
const NO_DATA = { text: "No Data", color: "#757575" };

export const aqiLegend = [
  GOOD,
  MODERATE,
  UNHEALTHY_SENSITIVE,
  UNHEALTHY,
  VERY_UNHEALTHY,
  HAZARDOUS,
];

export function getDisplay(type, value) {
  if (type == "aqi") {
    return getAQIDisplay(value);
  } else if (type == "pm2_5") {
    return getPM2_5Display(value);
  } else {
    return getPM10Display(value);
  }
}

// Based on https://www.airnow.gov/aqi/aqi-basics/
export function getAQIDisplay(value) {
  switch (true) {
    case value === undefined:
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
    default:
      return GOOD;
  }
}

// Based on https://blissair.com/what-is-pm-2-5.htm
export function getPM2_5Display(value) {
  switch (true) {
    case value === undefined:
      return NO_DATA;
    case value >= 250.5:
      return HAZARDOUS;
    case value >= 150.5:
      return VERY_UNHEALTHY;
    case value >= 55.5:
      return UNHEALTHY;
    case value >= 35.5:
      return UNHEALTHY_SENSITIVE;
    case value >= 12.1:
      return MODERATE;
    default:
      return GOOD;
  }
}

// Based on https://www.epa.vic.gov.au/for-community/environmental-information/air-quality/pm10-particles-in-the-air
export function getPM10Display(value) {
  switch (true) {
    case value === undefined:
      return NO_DATA;
    case value > 300:
      return HAZARDOUS;
    case value > 120:
      return VERY_UNHEALTHY;
    case value > 80:
      return UNHEALTHY_SENSITIVE;
    case value > 40:
      return MODERATE;
    default:
      return GOOD;
  }
}

export function toFahrenheit(celsius) {
  return (9 * celsius) / 5 + 32;
}

export function toCelsius(fehrenheit) {
  return (5 * (fehrenheit - 32)) / 9;
}

// Source: https://github.com/iwanaga/heat-index
// definition http://www.hpc.ncep.noaa.gov/html/heatindex_equation.shtml
// input = {
//     temperature: Number,  required
//     humidity   : Number,  required
// }
export function getHeatIndex(input) {
  var t = input.temperature || 0;
  var h = input.humidity || 0;

  // Steadman's result
  var heatIndex = 0.5 * (t + 61 + (t - 68) * 1.2 + h * 0.094);

  // regression equation of Rothfusz is appropriate
  if (t >= 80) {
    var heatIndexBase =
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
