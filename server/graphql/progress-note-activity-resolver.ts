import { IRootQueryType } from 'schema';
import CarePlanUpdateEvent from '../models/care-plan-update-event';
import PatientAnswerEvent from '../models/patient-answer-event';
import PatientScreeningToolSubmission from '../models/patient-screening-tool-submission';
import QuickCall from '../models/quick-call';
import TaskEvent from '../models/task-event';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

interface IResolveProgressNoteActivityOptions {
  progressNoteId: string;
}

export async function resolveProgressNoteActivityForProgressNote(
  root: any,
  args: IResolveProgressNoteActivityOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['progressNoteActivityForProgressNote']> {
  const { progressNoteId } = args;

  await checkUserPermissions(userId, permissions, 'view', 'progressNote', txn, progressNoteId);

  const taskEvents = await TaskEvent.getAllForProgressNote(progressNoteId, txn);
  const patientAnswerEvents = await PatientAnswerEvent.getAllForProgressNote(progressNoteId, txn);
  const carePlanUpdateEvents = await CarePlanUpdateEvent.getAllForProgressNote(progressNoteId, txn);
  const quickCallEvents = await QuickCall.getQuickCallsForProgressNote(progressNoteId, txn);
  const patientScreeningToolSubmissions = await PatientScreeningToolSubmission.getForProgressNote(
    progressNoteId,
    txn,
  );

  return {
    taskEvents,
    patientAnswerEvents,
    carePlanUpdateEvents,
    quickCallEvents,
    patientScreeningToolSubmissions,
  };
}
