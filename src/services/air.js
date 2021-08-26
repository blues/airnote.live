const GOOD = { text: 'Good', color: '#00CC00' };
const MODERATE = { text: 'Moderate', color: '#F8B52A' };
const UNHEALTHY_SENSITIVE = { text: 'Unhealthy for Sensitive Groups', color: '#EB8A14' };
const UNHEALTHY = { text: 'Unhealthy', color: '#FF0000' };
const VERY_UNHEALTHY = { text: 'Very Unhealthy', color: '#A10649' };
const HAZARDOUS = { text: 'Hazardous', color: '#7E0023' };
const NO_DATA = { text: 'No Data', color: '#757575' };

export function getDisplay(type, value) {
  if (type == 'aqi') {
    return getAQIDisplay(value);
  } else if (type == 'pm2_5') {
    return getPM2_5Display(value);
  } else {
    return getPM10Display(value);
  }
}

// Based on https://www.airnow.gov/aqi/aqi-basics/
export function getAQIDisplay(value) {
  switch(true) {
    case (!value):
      return NO_DATA;
    case (value > 300):
      return HAZARDOUS;
    case (value > 200):
      return VERY_UNHEALTHY
    case (value > 150):
      return UNHEALTHY;
    case (value > 100):
      return UNHEALTHY_SENSITIVE;
    case (value > 50):
      return MODERATE;
    default:
      return GOOD;
  }
}

// Based on https://blissair.com/what-is-pm-2-5.htm
export function getPM2_5Display(value) {
  switch(true) {
    case (!value):
      return NO_DATA;
    case (value > 250.5):
      return HAZARDOUS;
    case (value > 150.5):
      return VERY_UNHEALTHY
    case (value > 55.5):
      return UNHEALTHY;
    case (value > 35.5):
      return UNHEALTHY_SENSITIVE;
    case (value > 12.1):
      return MODERATE;
    default:
      return GOOD;
  }
}

// Based on https://www.epa.vic.gov.au/for-community/environmental-information/air-quality/pm10-particles-in-the-air
export function getPM10Display(value) {
  switch(true) {
    case (!value):
      return NO_DATA;
    case (value > 300):
      return HAZARDOUS;
    case (value > 120):
      return VERY_UNHEALTHY
    case (value > 80):
      return UNHEALTHY_SENSITIVE;
    case (value > 40):
      return MODERATE;
    default:
      return GOOD;
  }
}