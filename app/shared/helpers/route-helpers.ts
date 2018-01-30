export const getActiveMapRoute = (patientId: string): string => {
  return `/patients/${patientId}/map/active`;
};

export const getMapTaskRoute = (patientId: string, taskId: string): string => {
  return `/patients/${patientId}/map/active/tasks/${taskId}`;
};

export const getCBOReferralPDFRoute = (taskId: string, authToken: string): string => {
  return `/pdf/${taskId}/referral-form.pdf?token=${authToken}`;
};
