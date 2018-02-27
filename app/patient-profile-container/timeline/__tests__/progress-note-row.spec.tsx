import { shallow } from 'enzyme';
import * as React from 'react';
import { patient, progressNote } from '../../../shared/util/test-data';
import { ProgressNoteRow } from '../progress-note-row';

it('renders the progress note row', () => {
  const component = shallow(
    <ProgressNoteRow
      progressNote={progressNote}
      patientId={patient.id}
      progressNoteId={progressNote.id}
      glassBreakId="lady"
    />,
  );
  expect(component.find('.title').length).toBe(1);
  expect(
    component
      .find('.title')
      .at(0)
      .text(),
  ).toContain(progressNote.progressNoteTemplate.title);
});
