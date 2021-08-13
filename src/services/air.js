export function getAQIDisplay(value) {
  switch(true) {
    case (value > 300):
      return { text: 'Hazardous', color: '#7E0023' };
    case (value > 200):
      return { text: 'Very Unhealthy', color: '#A10649' };
    case (value > 150):
      return { text: 'Unhealthy', color: '#FF0000' };
    case (value > 100):
      return { text: 'Unhealthy for Sensitive Groups', color: '#EB8A14' };
    case (value > 50):
      return { text: 'Moderate', color: '#F8B52A' };
    default:
      return { text: 'Good', color: '#00CC00' };
  }
}
