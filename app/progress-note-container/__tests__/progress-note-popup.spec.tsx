import { shallow } from 'enzyme';
import * as React from 'react';
import {
  currentUser,
  progressNote,
  progressNoteTemplate,
  question,
} from '../../shared/util/test-data';
import { ProgressNotePopup as Component } from '../progress-note-popup';

const oldDate = Date.now;
const editProgressNote = jest.fn();
const completeProgressNote = jest.fn();
const getOrCreateProgressNote = jest.fn();
const completeProgressNoteSupervisorReview = jest.fn();
const progressNoteTemplates = [progressNoteTemplate];

describe('builder concerns', () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  describe('renders progress note popup with templates', () => {
    it('renders progress note popup with templates', async () => {
      const component = shallow(
        <Component
          progressNote={progressNote}
          questions={[question]}
          currentUser={currentUser}
          close={jest.fn()}
          editProgressNote={editProgressNote}
          completeProgressNote={completeProgressNote}
          completeProgressNoteSupervisorReview={completeProgressNoteSupervisorReview}
          createProgressNote={getOrCreateProgressNote}
          progressNoteTemplates={progressNoteTemplates}
        />,
      );
      const instance = component.instance() as Component;
      const result = instance.render();
      expect(result).toMatchSnapshot();
    });
    it('renders progress note', async () => {
      const component = shallow(
        <Component
          currentUser={currentUser}
          questions={[question]}
          close={jest.fn()}
          completeProgressNoteSupervisorReview={completeProgressNoteSupervisorReview}
          editProgressNote={editProgressNote}
          completeProgressNote={completeProgressNote}
          createProgressNote={getOrCreateProgressNote}
          progressNote={progressNote}
          progressNoteTemplates={progressNoteTemplates}
        />,
      );
      const instance = component.instance() as Component;

      const result = instance.render();
      expect(result).toMatchSnapshot();
    });
  });
});
