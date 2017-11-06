import { ShortPatientFragment } from '../../graphql/types';

export const getPatientFirstAndMiddleName = (patient: ShortPatientFragment) => {
  if (patient.middleName) {
    return `${patient.firstName} ${patient.middleName.charAt(0)}.`;
  } else {
    return patient.firstName;
  }
};

export const getPatientFullName = (patient: ShortPatientFragment) => {
  const firstName = getPatientFirstAndMiddleName(patient);
  const lastName = patient.lastName ? patient.lastName : null;
  return `${firstName} ${lastName}`;
};
