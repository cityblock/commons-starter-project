interface IPatientOptions {
  firstName: string;
  lastName: string;
  middleName?: string | null;
}

export const getPatientFirstAndMiddleName = (patient: IPatientOptions) => {
  if (patient.middleName) {
    return `${patient.firstName} ${patient.middleName.charAt(0)}.`;
  } else {
    return patient.firstName;
  }
};

export const getPatientFullName = (patient: IPatientOptions) => {
  const firstName = getPatientFirstAndMiddleName(patient);
  const lastName = patient.lastName ? patient.lastName : null;
  return `${firstName} ${lastName}`;
};
