export const getActiveMapRoute = (patientId: string): string => {
  return `/patients/${patientId}/map/active`;
};

export const getMapTaskRoute = (patientId: string, taskId: string): string => {
  return `/patients/${patientId}/map/active/tasks/${taskId}`;
};
