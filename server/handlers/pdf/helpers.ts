import { format } from 'date-fns';
import Patient from '../../models/patient';
import Task from '../../models/task';

export const formatFilename = (filename: string): string => {
  return `inline; filename="${filename}.pdf"`;
};

export const formatCBOReferralTaskPdfFileName = (task: Task): string => {
  if (!task.CBOReferral) return '';
  const CBOName = task.CBOReferral.CBO ? task.CBOReferral.CBO.name : task.CBOReferral.name;
  const { firstName, lastName } = task.patient;

  return `${firstName}_${lastName}_${CBOName}`;
};

export const formatPrintableMapPdfFileName = (patient: Patient): string => {
  const { firstName, middleName, lastName } = patient;
  const formattedMiddle = middleName ? `${middleName}_` : '';
  const formattedDate = format(Date.now(), 'MMM_D_YYYY');

  return `${firstName || ''}_${formattedMiddle}${lastName || ''}_${formattedDate}_MAP`;
};
