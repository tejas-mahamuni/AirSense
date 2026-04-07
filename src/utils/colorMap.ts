export type AQICategory =
  | "good"
  | "moderate"
  | "poor"
  | "unhealthy"
  | "very-unhealthy"
  | "hazardous";

export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "moderate";
  if (aqi <= 150) return "poor";
  if (aqi <= 200) return "unhealthy";
  if (aqi <= 300) return "very-unhealthy";
  return "hazardous";
}

export function getAQICategoryLabel(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

export function getAQIText(aqi: number): string {
  return getAQICategoryLabel(aqi);
}

export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return "#34C759";
  if (aqi <= 100) return "#FFD60A";
  if (aqi <= 150) return "#FF9F0A";
  if (aqi <= 200) return "#FF453A";
  if (aqi <= 300) return "#BF5AF2";
  return "#FF2D55";
}

export function getAQIGradient(aqi: number): string {
  if (aqi <= 50)
    return "linear-gradient(135deg, #0F4C75 0%, #1B6CA8 40%, #0D7377 100%)";
  if (aqi <= 100)
    return "linear-gradient(135deg, #2D5016 0%, #4A7C59 40%, #6B8F71 100%)";
  if (aqi <= 150)
    return "linear-gradient(135deg, #7B3F00 0%, #C67C52 40%, #8B5E3C 100%)";
  if (aqi <= 200)
    return "linear-gradient(135deg, #6B0000 0%, #A31515 40%, #8B0000 100%)";
  return "linear-gradient(135deg, #1A0030 0%, #4B0082 40%, #2D0057 100%)";
}

export function getHealthAdvice(aqi: number): string {
  if (aqi <= 50)
    return "Air quality is satisfactory. Enjoy outdoor activities!";
  if (aqi <= 100)
    return "Acceptable quality. Unusually sensitive people should limit prolonged outdoor exertion.";
  if (aqi <= 150)
    return "Sensitive groups may experience health effects. Consider reducing outdoor activity.";
  if (aqi <= 200)
    return "Everyone may begin to experience health effects. Limit outdoor exertion.";
  if (aqi <= 300)
    return "Health alert: significant risk. Avoid outdoor activities.";
  return "Health emergency. Stay indoors with air purification.";
}
