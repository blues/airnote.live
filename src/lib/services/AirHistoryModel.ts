export interface AirnoteHistoryReadings {
	aqi: Record<string, number>;
	pm1_0: Record<string, number>;
	pm2_5: Record<string, number>;
	pm10_0: Record<string, number>;
}
