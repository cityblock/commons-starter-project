const PHONE_REGEX = /^\+1\d{10}$/;

export const VALID_PHONE_NUMBER_LENGTH = 12;

// formats phone numbers in Twilio format for easy lookup
export const formatPhoneNumberForTwilio = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  // remove all non-digit characters
  const strippedNumber = phoneNumber.replace(/\D/g, '');

  // if no country code provided, assume it is a US based number
  if (strippedNumber.length <= 10) {
    return `+1${strippedNumber}`;
  } else if (strippedNumber[0] === '+') {
    return strippedNumber;
  }

  return `+${strippedNumber}`;
};

export const validatePhoneNumberForTwilio = async (
  phoneNumber: string | undefined,
): Promise<void> => {
  if (phoneNumber && !phoneNumber.match(PHONE_REGEX)) {
    return Promise.reject('Phone number must be in +12345678901 format');
  }
};
