import { shallow } from 'enzyme';
import * as React from 'react';
import { progressNote } from '../../shared/util/test-data';
import ProgressNoteRow from '../progress-note-row';

it('renders the progress note row', () => {
  const component = shallow(<ProgressNoteRow progressNote={progressNote} />);
  expect(component.find('.title').length).toBe(1);
  expect(
    component
      .find('.title')
      .at(0)
      .text(),
  ).toBe(progressNote.progressNoteTemplate.title);
});
