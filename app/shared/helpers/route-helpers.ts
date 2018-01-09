export const getActiveMapRoute = (patientId: string): string => {
  return `/patients/${patientId}/map/active`;
};
