import { format } from 'date-fns';

const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export const formatFullName = (firstName?: string, lastName?: string): string =>
  `${firstName || 'Unknown'} ${lastName || 'Unknown'}`;

export const formatDueDate = (dueDate?: string, complete?: boolean): string => {
  if (!complete) {
    if (isDueToday(dueDate)) return 'Due today';
    if (isPastDue(dueDate)) return `Past due ${formatPastDue(dueDate)}`;
    if (isDueSoon(dueDate)) return 'Due tomorrow';
  }

  const prefix = complete ? 'Completed' : 'Due';
  return dueDate ? `${prefix} ${format(new Date(dueDate), 'MMM D, YYYY')}` : 'Unknown Due Date';
};

export const formatInputDate = (dueDate?: string): string =>
  format(dueDate || Date.now(), 'YYYY-MM-DD');

export const formatDueDateDefault = (dueDate?: string): string =>
  format(dueDate || Date.now(), 'MM/DD/YYYY');

export const isDueSoon = (dueDate?: string): boolean => {
  if (!dueDate) return false;

  const dueDateAsDate = new Date(dueDate) as any;
  const timeLeft = dueDateAsDate - Date.now();

  return isDueToday(dueDate) || timeLeft < ONE_DAY_IN_MILLISECONDS;
};

export const isPastDue = (dueDate?: string): boolean => {
  if (!dueDate) return false;

  const dueDateAsDate = new Date(dueDate) as any;

  // first part of expression accounts for fact that date
  // is stored with midnight timestamp
  return !isDueToday(dueDate) && dueDateAsDate - Date.now() < 0;
};

const isDueToday = (dueDate?: string): boolean => {
  if (!dueDate) return false;

  const dueDateAsDate = new Date(dueDate) as any;
  const now = new Date(Date.now());

  return dueDateAsDate.toDateString() === now.toDateString();
};

const formatPastDue = (dueDate?: string): string => {
  if (!dueDate) return '';

  const dueDateAsDate = new Date(dueDate) as any;
  const now = new Date(Date.now()) as any;

  const difference = now - dueDateAsDate;
  const differenceInDays = Math.floor(difference / ONE_DAY_IN_MILLISECONDS);
  const suffix = differenceInDays === 1 ? 'day' : 'days';

  return `${differenceInDays} ${suffix}`;
};
