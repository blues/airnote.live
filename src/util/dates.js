import DATE_RANGE_OPTIONS from "../constants/DateRangeOptions";

export function convertDateRange(selectedDateRange) {
  switch (true) {
    case selectedDateRange === DATE_RANGE_OPTIONS.ONE_DAY.displayText:
      return DATE_RANGE_OPTIONS.ONE_DAY.queryText;
    case selectedDateRange === DATE_RANGE_OPTIONS.TWO_DAYS.displayText:
      return DATE_RANGE_OPTIONS.TWO_DAYS.queryText;
    case selectedDateRange === DATE_RANGE_OPTIONS.THREE_DAYS.displayText:
      return DATE_RANGE_OPTIONS.THREE_DAYS.queryText;
    case selectedDateRange === DATE_RANGE_OPTIONS.FIVE_DAYS.displayText:
      return DATE_RANGE_OPTIONS.FIVE_DAYS.queryText;
    case selectedDateRange === DATE_RANGE_OPTIONS.SEVEN_DAYS.displayText:
      return DATE_RANGE_OPTIONS.SEVEN_DAYS.queryText;
    default:
      return DATE_RANGE_OPTIONS.SEVEN_DAYS.queryText;
  }
}

export const dateRanges = [
  DATE_RANGE_OPTIONS.ONE_DAY.displayText,
  DATE_RANGE_OPTIONS.TWO_DAYS.displayText,
  DATE_RANGE_OPTIONS.THREE_DAYS.displayText,
  DATE_RANGE_OPTIONS.FIVE_DAYS.displayText,
  DATE_RANGE_OPTIONS.SEVEN_DAYS.displayText,
];
