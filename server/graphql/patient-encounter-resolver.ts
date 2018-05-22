import { sortBy } from 'lodash';
import { transaction } from 'objection';
import { IRootQueryType } from 'schema';
import ProgressNote from '../models/progress-note';
import { loadPatientEncounters } from './shared/gcs/helpers';
import checkUserPermissions, { validateGlassBreak } from './shared/permissions-check';
import { IContext } from './shared/utils';

export async function resolvePatientEncounters(
  root: any,
  args: { patientId: string; glassBreakId: string },
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['patientEncounters']> {
  const { patientId } = args;
  return transaction(testTransaction || ProgressNote.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);
    await validateGlassBreak(
      userId!,
      permissions,
      'patient',
      args.patientId,
      txn,
      args.glassBreakId,
    );

    const progressNotes = await ProgressNote.getAllIdsForPatient(patientId, true, txn);
    const formattedProgressNotes = progressNotes.map(progressNote => ({
      id: progressNote.id,
      date: progressNote.createdAt,
      progressNoteId: progressNote.id,
    }));
    const externalEncounters = await loadPatientEncounters(patientId);
    const allEncounters = (formattedProgressNotes as any).concat(externalEncounters);

    return sortBy(allEncounters, encounter => -Date.parse(encounter.date));
  });
}
