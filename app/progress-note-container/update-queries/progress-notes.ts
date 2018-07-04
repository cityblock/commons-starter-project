import { getProgressNotesForCurrentUser, progressNoteCreated } from '../../graphql/types';

interface ISubscriptionData {
  subscriptionData: {
    data?: {
      progressNoteCreated: progressNoteCreated['progressNoteCreated'];
    };
  };
}

export const progressNotesUpdateQuery = (
  previousResult: getProgressNotesForCurrentUser,
  { subscriptionData }: ISubscriptionData,
) => {
  if (!subscriptionData.data) return previousResult;

  const newProgressNote = subscriptionData.data.progressNoteCreated;
  // ensure we don't double add
  if (
    previousResult.progressNotesForCurrentUser &&
    !previousResult.progressNotesForCurrentUser.find(note => note.id === newProgressNote.id)
  ) {
    return {
      progressNotesForCurrentUser: [newProgressNote, ...previousResult.progressNotesForCurrentUser],
    };
  }

  return previousResult;
};
