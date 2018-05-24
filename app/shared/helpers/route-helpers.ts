export const getPatientRoute = (patientId: string): string => {
  return `/patients/${patientId}`;
};

export const getActiveMapRoute = (patientId: string): string => {
  return `/patients/${patientId}/map/active`;
};

export const getMapTaskRoute = (patientId: string, taskId: string, goalId?: string): string => {
  if (goalId) {
    return `/patients/${patientId}/map/active/goals/${goalId}/tasks/${taskId}`;
  }
  return `/patients/${patientId}/map/active/tasks/${taskId}`;
};

export const getCBOReferralPdfRoute = (taskId: string, authToken: string): string => {
  return `/pdf/${taskId}/referral-form.pdf?token=${authToken}`;
};

export const getPrintableCalendarPdfRoute = (
  patientId: string,
  month: number,
  year: number,
  authToken: string,
): string => {
  return `/pdf/${patientId}/${year}/${month}/printable-calendar.pdf?token=${authToken}`;
};

export const getPrintableMapPdfRoute = (patientId: string, authToken: string): string => {
  return `/pdf/${patientId}/printable-map.pdf?token=${authToken}`;
};

export const getContactsVcfRoute = (authToken: string): string => {
  return `/vcf-contacts?token=${authToken}`;
};
