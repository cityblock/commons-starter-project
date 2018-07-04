import { progressNote } from '../../../shared/util/test-data';
import { progressNotesUpdateQuery } from '../progress-notes';

describe('progressNotesUpdateQuery', () => {
  it('returns previous result if no new data', () => {
    const result = progressNotesUpdateQuery(
      { progressNotesForCurrentUser: [] },
      {
        subscriptionData: {},
      },
    );

    expect(result).toEqual({ progressNotesForCurrentUser: [] });
  });

  it('adds document to store', () => {
    const result = progressNotesUpdateQuery(
      { progressNotesForCurrentUser: [] },
      {
        subscriptionData: { data: { progressNoteCreated: progressNote } },
      },
    );

    expect(result).toEqual({
      progressNotesForCurrentUser: [progressNote],
    });
  });

  it('does not double add document', () => {
    const result = progressNotesUpdateQuery(
      { progressNotesForCurrentUser: [progressNote] },
      {
        subscriptionData: { data: { progressNoteCreated: progressNote } },
      },
    );

    expect(result).toEqual({
      progressNotesForCurrentUser: [progressNote],
    });
  });
});
