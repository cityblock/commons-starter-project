import { capitalize, lowerCase, padStart } from 'lodash';

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

interface IAddress {
  street1: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  street2?: string | null;
}
export const formatAddress = (address?: IAddress | null): string => {
  if (!address) {
    return '';
  }
  const { street1, street2, city, state, zip } = address;
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
  if (!state) {
    return `${formattedCity}${zip || ''}`;
  }
  return `${formattedCity}${state} ${zip || ''}`;
};

export const formatPhoneNumber = (phoneNumber?: string | null): string => {
  if (!phoneNumber) {
    return '';
  }
  const phoneNumberDupe = phoneNumber.slice(0).replace('+1', '');
  if (phoneNumberDupe.length === 10) {
    const areaCode = phoneNumberDupe.substring(0, 3);
    const first = phoneNumberDupe.substring(3, 6);
    const second = phoneNumberDupe.substring(6);
    return `(${areaCode}) ${first}-${second}`;
  }
  return phoneNumberDupe;
};

export const formatCityblockId = (id: number): string => {
  return `CBH-${padStart(id.toString(), 7, '0')}`;
};
