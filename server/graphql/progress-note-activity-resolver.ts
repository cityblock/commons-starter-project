import { IProgressNoteActivity } from 'schema';
import CarePlanUpdateEvent from '../models/care-plan-update-event';
import PatientAnswerEvent from '../models/patient-answer-event';
import QuickCall from '../models/quick-call';
import TaskEvent from '../models/task-event';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

interface IResolveProgressNoteActivityOptions {
  progressNoteId: string;
}

export async function resolveProgressNoteActivityForProgressNote(
  root: any,
  args: IResolveProgressNoteActivityOptions,
  { db, userRole, userId }: IContext,
): Promise<IProgressNoteActivity> {
  const { progressNoteId } = args;
  await accessControls.isAllowed(userRole, 'view', 'progressNote');
  checkUserLoggedIn(userId);

  // TODO: Fix typings
  const taskEvents = (await TaskEvent.getAllForProgressNote(progressNoteId)) as any;
  const patientAnswerEvents = (await PatientAnswerEvent.getAllForProgressNote(
    progressNoteId,
  )) as any;
  const carePlanUpdateEvents = (await CarePlanUpdateEvent.getAllForProgressNote(
    progressNoteId,
  )) as any;
  const quickCallEvents = (await QuickCall.getQuickCallsForProgressNote(progressNoteId)) as any;

  return {
    taskEvents,
    patientAnswerEvents,
    carePlanUpdateEvents,
    quickCallEvents,
  };
}
