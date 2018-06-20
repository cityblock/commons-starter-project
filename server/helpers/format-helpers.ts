import { capitalize, lowerCase } from 'lodash';

export const formatAbbreviatedName = (
  firstName: string,
  lastName: string,
  preferredName?: string | null,
): string => {
  if (preferredName) {
    return `${capitalize(firstName)} (${capitalize(preferredName)}) ${capitalize(lastName)[0]}.`;
  }

  return `${capitalize(firstName)} ${capitalize(lastName)[0]}.`;
};

export const formatChannelDisplayName = (
  firstName: string,
  lastName: string,
  cityblockId: number,
): string => {
  return `${formatPatientName(firstName, lastName)} ${cityblockId}`;
};

export const formatPatientName = (firstName: string, lastName: string): string => {
  return `${capitalize(firstName)} ${capitalize(lastName)}`;
};

export const formatChannelName = (
  firstName: string,
  lastName: string,
  cityblockId: number,
): string => {
  const formattedFirstName = removeSpaces(lowerCase(firstName));
  const formattedLastName = removeSpaces(lowerCase(lastName));

  return `${formattedFirstName}-${formattedLastName}-${cityblockId}`;
};

const removeSpaces = (name: string): string => {
  return name.split(' ').join('-');
};
