const PHONE_REGEX = /^\+1\d{10}$/;

// formats phone numbers in Twilio format for easy lookup
export const formatPhoneNumberForTwilio = (phoneNumber: string): string => {
  // remove all non-digit characters
  const strippedNumber = phoneNumber.replace(/\D/g, '');

  // if no country code provided, assume it is a US based number
  if (strippedNumber.length <= 10) {
    return `+1${strippedNumber}`;
  }

  return `+${strippedNumber}`;
};

export const validatePhoneNumberForTwilio = (
  phoneNumber: string | undefined,
): Promise<void> | void => {
  if (phoneNumber && !phoneNumber.match(PHONE_REGEX)) {
    return Promise.reject('Phone number must be in +12345678901 format');
  }
};
