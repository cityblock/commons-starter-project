import { differenceInYears, format } from 'date-fns';
import { padStart, startCase } from 'lodash';
import {
  CurrentPatientState,
  FullPatientAnswerFragment,
  ShortPatientFragment,
  ShortPatientScreeningToolSubmission360Fragment,
  UserRole,
} from '../../graphql/types';
import { Color } from '../library/small-text/small-text';

const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export const formatFullName = (firstName?: string | null, lastName?: string | null): string =>
  `${firstName || 'Unknown'} ${lastName || 'Unknown'}`;

export const formatPatientName = (patient: ShortPatientFragment) =>
  [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(' ');

export const formatPatientNameForProfile = (patient: ShortPatientFragment) => {
  const names = [patient.firstName, patient.middleName, patient.lastName].filter(Boolean);

  // abbreviate middle name if it is present
  if (names.length === 3 && names[1]) {
    names[1] = `${names[1]![0]}.`;
  }

  return names.join(' ');
};

export const formatCityblockId = (id: number): string => {
  return `CBH-${padStart(id.toString(), 7, '0')}`;
};

export const formatCareTeamMemberRole = (role: UserRole): string => {
  if (role === 'admin') {
    return 'Behavioral Health Specialist';
  }

  return startCase(role);
};

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

export const formatGender = (gender: string | null): string => {
  if (gender === null || (gender !== 'female' && gender !== 'male')) return 'Unknown';

  return gender === 'female' ? 'Female' : 'Male';
};

export const formatDateOfBirth = (dateOfBirth?: string | null): string => {
  if (!dateOfBirth) return 'Unknown';
  return format(dateOfBirth, 'MM/DD/YYYY');
};

export const formatDateAsTimestamp = (date: string | null | undefined): string | null => {
  if (!date) return null;

  const splitDate = date.split('-');
  const year = parseInt(splitDate[0], 10);
  const month = parseInt(splitDate[1], 10) - 1;
  const day = parseInt(splitDate[2], 10);
  return new Date(Date.UTC(year, month, day)).toISOString();
};

export const formatAgeDetails = (dateOfBirth: string | null, gender: string | null): string => {
  if (!dateOfBirth && !gender) return '';

  const formattedGender = gender ? `${gender[0].toUpperCase()}` : '';
  const space = dateOfBirth && gender ? ' ' : '';

  return `(${formatAge(dateOfBirth)}${space}${formattedGender})`;
};

export const formatAddress = (
  street1: string | null,
  city: string | null,
  state: string | null,
  zip: string | null,
  street2?: string | null,
): string => {
  const line1 = formatAddressFirstLine({ street1, street2 });
  const line2 = formatAddressSecondLine({ state, city, zip });

  return line1 ? `${line1}, ${line2}` : line2 || '';
};

export const formatAddressFirstLine = (address: {
  street1?: string | null;
  street2?: string | null;
}): string | null => {
  const { street1, street2 } = address;
  if (!street1) {
    return null;
  }

  if (street1 && street2) {
    return `${street1}, ${street2}`;
  }

  return street1;
};

export const formatAddressSecondLine = (address: {
  state?: string | null;
  city?: string | null;
  zip?: string | null;
}): string | null => {
  const { state, city, zip } = address;
  if (!(state || city || zip)) {
    return null;
  }

  let formattedCity = city;
  if (city && (zip || state)) {
    formattedCity = `${city}, `;
  }
  return `${formattedCity}${state} ${zip}`;
};

export const formatCBOReferralTaskTitle = (CBOName: string): string => {
  return `CBO Referral: ${CBOName}`;
};

export const formatScreeningToolScore = (
  submission: ShortPatientScreeningToolSubmission360Fragment,
): string => {
  if (submission.score === null) return '';
  return submission.screeningToolScoreRange
    ? `${submission.score} - ${submission.screeningToolScoreRange.description}`
    : `${submission.score}`;
};

export const formatPatientAnswer = (patientAnswer: FullPatientAnswerFragment): string => {
  if (patientAnswer.question && patientAnswer.question.answerType === 'freetext') {
    return patientAnswer.answerValue;
  } else {
    return patientAnswer.answer.displayValue;
  }
};

export const getPatientStatusColor = (patientStatus: CurrentPatientState) => {
  switch (patientStatus) {
    case CurrentPatientState.disenrolled:
    case CurrentPatientState.ineligible:
      return 'red' as Color;
    case CurrentPatientState.consented:
      return 'blue' as Color;
    case CurrentPatientState.outreach:
      return 'purple' as Color;
    case CurrentPatientState.enrolled:
      return 'green' as Color;
    case CurrentPatientState.assigned:
      return 'black' as Color;
    case CurrentPatientState.attributed:
      return 'gray' as Color;
    default:
      return undefined;
  }
};
