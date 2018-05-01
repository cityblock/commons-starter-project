import { capitalize, lowerCase } from 'lodash';

export const formatAbbreviatedName = (firstName: string, lastName: string): string => {
  return `${capitalize(firstName)} ${capitalize(lastName)[0]}.`;
};

export const formatChannelDisplayName = (
  firstName: string,
  lastName: string,
  cityblockId: number,
): string => {
  return `${capitalize(firstName)} ${capitalize(lastName)} ${cityblockId}`;
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
