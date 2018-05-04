import { addDays, addHours, addMonths, addWeeks, addYears } from 'date-fns';
import { CompletedWithinInterval } from 'schema';

// helper for date math
export function dateAdd(
  date: Date,
  completedWithinNumber: number,
  completedWithinInterval: CompletedWithinInterval,
): Date {
  switch (completedWithinInterval) {
    case 'day':
      return addDays(date, completedWithinNumber);
    case 'hour':
      return addHours(date, completedWithinNumber);
    case 'month':
      return addMonths(date, completedWithinNumber);
    case 'year':
      return addYears(date, completedWithinNumber);
    case 'week':
      return addWeeks(date, completedWithinNumber);
    default:
      return date;
  }
}
