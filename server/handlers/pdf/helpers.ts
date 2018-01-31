import Task from '../../models/task';

export const formatFilename = (filename: string): string => {
  return `inline; filename="${filename}.pdf"`;
};

export const formatCBOReferralTaskPDFFileName = (task: Task): string => {
  if (!task.CBOReferral) return '';
  const CBOName = task.CBOReferral.CBO ? task.CBOReferral.CBO.name : task.CBOReferral.name;
  const { firstName, lastName } = task.patient;

  return `${firstName}_${lastName}_${CBOName}`;
};
