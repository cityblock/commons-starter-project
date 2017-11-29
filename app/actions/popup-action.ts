export interface IProgressNoteOpen {
  type: 'PROGRESS_NOTE_OPEN';
  patientId: string;
}

export interface IProgressNoteClose {
  type: 'PROGRESS_NOTE_CLOSE';
}

export function openProgressNote(patientId: string): IProgressNoteOpen {
  return {
    type: 'PROGRESS_NOTE_OPEN',
    patientId,
  };
}

export function closeProgressNote(): IProgressNoteClose {
  return {
    type: 'PROGRESS_NOTE_CLOSE',
  };
}
