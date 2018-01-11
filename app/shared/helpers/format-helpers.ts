import { differenceInYears, format } from 'date-fns';
import { ShortPatientScreeningToolSubmission360Fragment } from '../../graphql/types';

const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export const formatFullName = (firstName?: string | null, lastName?: string | null): string =>
  `${firstName || 'Unknown'} ${lastName || 'Unknown'}`;

export const formatInputDate = (dueDate?: string): string =>
  format(dueDate || Date.now(), 'YYYY-MM-DD');

export const isDueSoon = (dueDate?: string | null): boolean => {
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

export const formatAge = (dateOfBirth?: string | null): string => {
  if (!dateOfBirth) return '';
  return `${differenceInYears(Date.now(), dateOfBirth)}`;
};

export const formatDateOfBirth = (dateOfBirth?: string | null): string => {
  if (!dateOfBirth) return 'Unknown';
  return format(dateOfBirth, 'MM/DD/YYYY');
};

export const formatAgeDetails = (dateOfBirth: string | null, gender: string | null): string => {
  if (!dateOfBirth && !gender) return '';

  const formattedGender = gender ? `${gender.toUpperCase()}` : '';
  const space = dateOfBirth && gender ? ' ' : '';

  return `(${formatAge(dateOfBirth)}${space}${formattedGender})`;
};

export const formatScreeningToolScore = (
  submission: ShortPatientScreeningToolSubmission360Fragment,
): string => {
  if (submission.score === null) return '';
  return submission.screeningToolScoreRange
    ? `${submission.score} - ${submission.screeningToolScoreRange.description}`
    : `${submission.score}`;
};
