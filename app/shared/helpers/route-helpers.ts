export const getPatientRoute = (patientId: string): string => {
  return `/patients/${patientId}`;
};

export const getActiveMapRoute = (patientId: string): string => {
  return `/patients/${patientId}/map/active`;
};

export const getMapTaskRoute = (patientId: string, taskId: string): string => {
  return `/patients/${patientId}/map/active/tasks/${taskId}`;
};

export const getCBOReferralPdfRoute = (taskId: string, authToken: string): string => {
  return `/pdf/${taskId}/referral-form.pdf?token=${authToken}`;
};

export const getPrintableMapPdfRoute = (patientId: string, authToken: string): string => {
  return `/pdf/${patientId}/printable-map.pdf?token=${authToken}`;
};
