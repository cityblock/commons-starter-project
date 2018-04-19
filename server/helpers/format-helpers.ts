import { capitalize } from 'lodash';

export const formatAbbreviatedName = (firstName: string, lastName: string): string => {
  return `${capitalize(firstName)} ${capitalize(lastName)[0]}.`;
};
