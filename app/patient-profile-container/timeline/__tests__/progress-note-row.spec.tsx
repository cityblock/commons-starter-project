import { shallow } from 'enzyme';
import React from 'react';
import { patient, progressNote } from '../../../shared/util/test-data';
import { ProgressNoteRow } from '../progress-note-row';
import TimelineCard from '../shared/timeline-card';

it('renders the progress note row', () => {
  const component = shallow(
    <ProgressNoteRow
      progressNote={progressNote}
      patientId={patient.id}
      progressNoteId={progressNote.id}
      glassBreakId="lady"
    />,
  );
  expect(component.find(TimelineCard).props().progressNote).toEqual(progressNote);
});
